import { ITask, IProject, ITaskResult } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';
import { TestsTaskResult } from '../results';

export default class TestsTask extends FileSearcherTask implements ITask {
  constructor(project: IProject, result: ITaskResult[]) {
    const SEARCH_PATTERNS = {
      unit: ['**/tests/unit/**/*.js'],
      integration: ['**/tests/integration/**/*.js'],
      acceptance: ['**/tests/acceptance/**/*.js'],
    };

    super(project, result, SEARCH_PATTERNS);
  }

  async run() {
    let result = new TestsTaskResult();
    result.tests = await this.searcher.search();

    this.taskResults.push(result);

    return this.taskResults;
  }
}
