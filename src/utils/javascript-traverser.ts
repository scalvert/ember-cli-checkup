// import { File } from '@babel/types';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { javascriptAstCache as astCache } from './ast-cache';
import getFileContents from './get-file-contents';

const PARSE_OPTIONS = { allowImportExportEverywhere: true };

/**
 * Provides an abstract implementation of a SearchTraverser aimed at
 * traversing the contents of a JavaScript file.
 */
export default abstract class JavaScriptTraverser {
  abstract get visitors(): object;
  fileContents!: string;

  traverseAst(fullFilePath: string) {
    this.fileContents = getFileContents(fullFilePath);

    if (!astCache.has(fullFilePath)) {
      astCache.set(fullFilePath, parser.parse(this.fileContents, PARSE_OPTIONS));
    }

    let ast: any = astCache.get(fullFilePath);

    traverse(ast, this.visitors);
  }
}
