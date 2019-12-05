import * as fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as globby from 'globby';
import { IASTSearchResult, ISearchVisitor } from '../interfaces';
// import ASTSearchResult from './ast-search-result';

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
   * Notes:
   *  Possibly refactor the SearchVisitor pattern to track an array of "path" objects from Babel.
   *  This would allow the search method below to associate a file to an array of results in that file.
   *  We would maintain a standardized result inside of the search method, which is an array of { fileName: string, nodes: [] }.
   */
  async search(searchVisitor: ISearchVisitor): Promise<IASTSearchResult[]> {
    // let searchResults: IASTSearchResult[] = [];
    let paths = await globby('**/*.js', { cwd: this.path });


    paths.forEach(path => {
      // let searchResult = new ASTSearchResult();
      let file: string = fs.readFileSync( this.path + '/' + path, { encoding: 'utf-8' });
      let ast: any = parser.parse(file, PARSE_OPTIONS);

      traverse(ast, searchVisitor.visitors);
      // searchResults.push(searchResult);
    });

    return searchVisitor.results;
  }
}
