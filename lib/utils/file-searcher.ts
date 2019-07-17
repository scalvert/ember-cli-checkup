/* eslint-env node */
import globby from 'globby';
import capitalize from 'capitalize';

type SearchPatterns = { [key: string]: string[] };

const IGNORE_PATTERNS = [
  '!tests/**',
  '!node_modules/**',
  '!bower_components/**',
  '!tests/dummy/**',
];

export default class Searcher {
  baseDir: string;
  searchPatterns: SearchPatterns;
  searchPromises: Array<Promise<any>>;

  constructor(baseDir: string, searchPatterns: SearchPatterns) {
    this.baseDir = baseDir;
    this.searchPatterns = searchPatterns;
    this.searchPromises = [];
  }

  async search() {
    Object.keys(this.searchPatterns).forEach(pattern => {
      this.searchPromises.push(this._getSearchItem(pattern));
    });

    await Promise.all(this.searchPromises);
  }

  async _getSearchItem(pattern) {
    let files = await globby(this.searchPatterns[pattern].concat(IGNORE_PATTERNS), {
      cwd: this.baseDir,
    });

    let result = [capitalize(pattern), files.length];

    return result;
  }
}
