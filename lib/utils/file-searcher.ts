import * as globby from 'globby';
import { SearchPatterns } from '../../interfaces';

const IGNORE_PATTERNS: string[] = ['!node_modules/**', '!bower_components/**', '!tests/dummy/**'];

export default class FileSearcher {
  baseDir: string;
  searchPatterns: SearchPatterns;
  searchPromises: Promise<string[]>[];

  constructor(baseDir: string, searchPatterns: SearchPatterns) {
    this.baseDir = baseDir;
    this.searchPatterns = searchPatterns;
    this.searchPromises = [];
  }

  search() {
    Object.keys(this.searchPatterns).forEach(pattern => {
      this.searchPromises.push(this._getSearchItem(pattern));
    });

    return Promise.all(this.searchPromises);
  }

  _getSearchItem(pattern: string): Promise<string[]> {
    let patterns = this.searchPatterns[pattern].concat(IGNORE_PATTERNS);
    return globby(patterns);
  }
}
