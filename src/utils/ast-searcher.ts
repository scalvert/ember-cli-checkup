import * as fs from 'fs';
import * as parser from '@babel/parser';
import traverse, { Node } from '@babel/traverse';
import * as globby from 'globby';
import * as path from 'path';
import { ISearchVisitor } from '../interfaces';
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

  async search(searchVisitor: ISearchVisitor): Promise<Map<string, Node[]>> {
    let searchResultMap = new Map<string, Node[]>();
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

      if (searchVisitor.results.length) {
        let nodes: Node[] = searchVisitor.results;

        searchResultMap.set(filePath, nodes);

        searchVisitor.clearResults();
      }
    });

    return searchResultMap;
  }
}
