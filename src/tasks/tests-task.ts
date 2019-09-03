import { ITask, IProject, ICheckupResult } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';

export default class TestsTask extends FileSearcherTask implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    const SEARCH_PATTERNS = {
      unit: ['**/tests/unit/**/*.js'],
      acceptance: ['**/tests/acceptance/**/*.js'],
      integration: ['**/tests/integration/**/*.js'],
    };

    super(project, result, SEARCH_PATTERNS);
  }

  async run() {
    this.result.tests = await this.searcher.search();

    return this.result;
  }
}
