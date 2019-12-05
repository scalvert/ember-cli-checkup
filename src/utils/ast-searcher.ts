import * as fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as globby from 'globby';
import { IASTSearchResult } from '../interfaces';
import ASTSearchResult from './ast-search-result';

const PARSE_OPTIONS = { allowImportExportEverywhere: true };

export default class AstSearcher {
  path: string;

  /**
   * @param path The root path in which the searcher will begin the search.
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   *
   */
  async search(visitors: any): Promise<IASTSearchResult[]> {
    let searchResults: IASTSearchResult[] = [];
    let paths = await globby('**/*.js', { cwd: this.path });


    paths.forEach(path => {
      let searchResult = new ASTSearchResult();
      let file: string = fs.readFileSync( this.path + '/' + path, { encoding: 'utf-8' });
      let ast: any = parser.parse(file, PARSE_OPTIONS);

      traverse(ast, visitors);
      searchResults.push(searchResult);
    });

    return searchResults;
  }
}
