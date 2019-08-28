import * as globby from 'globby';
import { SearchPatterns } from '../../interfaces';

const IGNORE_PATTERNS: string[] = ['!node_modules/**', '!bower_components/**', '!tests/dummy/**'];

/**
 * @class FileSearcher
 *
 * Provides static file searching capabilities.
 */
export default class FileSearcher {
  baseDir: string;
  searchPatterns: SearchPatterns;
  searchPromises: Promise<string[]>[];

  /**
   *
   * @param baseDir {String} the top level directory to start searching
   * @param searchPatterns {SearchPatterns} the collection of patterns to search for. A pattern is
   *                                        in the form of `{ [key: string]: string[] }`
   */
  constructor(baseDir: string, searchPatterns: SearchPatterns) {
    this.baseDir = baseDir;
    this.searchPatterns = searchPatterns;
    this.searchPromises = [];
  }

  /**
   * Invokes the search, for each search pattern.
   */
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
