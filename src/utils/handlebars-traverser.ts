import { AST, traverse, preprocess } from '@glimmer/syntax';
import { handlebarsAstCache as astCache } from './ast-cache';
import getFileContents from './get-file-contents';

/**
 * Provides an abstract implementation of a SearchTraverser aimed at
 * traversing the contents of a Handlebars file.
 */
export default abstract class HandlebarsTraverser {
  abstract get visitors(): object;
  fileContents!: string;

  traverseAst(fullFilePath: string) {
    this.fileContents = getFileContents(fullFilePath);

    if (!astCache.has(fullFilePath)) {
      astCache.set(fullFilePath, preprocess(this.fileContents));
    }

    let ast: AST.Template = astCache.get(fullFilePath);

    traverse(ast, this.visitors);
  }
}