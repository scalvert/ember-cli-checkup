import * as fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as globby from 'globby';
import * as path from 'path';
import { ISearchTraverser } from '../interfaces';
import astCache from './ast-cache';

const PARSE_OPTIONS = { allowImportExportEverywhere: true };

export default class AstSearcher {
  rootSearchPath: string;
  globPatterns: Array<string>;

  /**
   * @param rootSearchPath The root path in which the searcher will begin the search.
   * @param globPatterns The array of file search patterns
   */
  constructor(rootSearchPath: string, globPatterns: Array<string> = ['**/*.js']) {
    this.rootSearchPath = rootSearchPath;
    this.globPatterns = globPatterns;
  }

  async search<T>(searchVisitor: ISearchTraverser<T>): Promise<Map<string, T>> {
    let searchResultMap = new Map<string, T>();
    let paths = await globby(this.globPatterns, { cwd: this.rootSearchPath });

    paths.forEach(filePath => {
      let fullFilePath: string = path.join(this.rootSearchPath, filePath);
      let file: string = fs.readFileSync(fullFilePath, {
        encoding: 'utf-8',
      });

      if (!astCache.has(fullFilePath)) {
        astCache.set(fullFilePath, parser.parse(file, PARSE_OPTIONS));
      }

      let ast: any = astCache.get(fullFilePath);

      traverse(ast, searchVisitor.visitors);

      if (searchVisitor.hasResults) {
        let nodes: T = searchVisitor.results;

        searchResultMap.set(fullFilePath, nodes);

        searchVisitor.reset();
      }
    });

    return searchResultMap;
  }
}
