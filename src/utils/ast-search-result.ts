import { IASTSearchResult } from '../interfaces';
import { Node } from '@babel/traverse';

export default class ASTSearchResult implements IASTSearchResult {
  filePath!: string;
  nodes!: Node[];
}
