import { ITask, IProject, ITaskResult /*, IASTSearchResult */ } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';
// import AstSearcher from '../utils/ast-searcher';
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
    // result.tests = await this.searcher.search();

    // let searchResult: IASTSearchResult[] = [];
    // let astSearcher: AstSearcher = new AstSearcher(this.project.root);

    // let searchResults = await astSearcher.search({
    //   FunctionExpression: function(path: any) {
    //     // i've found something that i want to track
    //     // store the thing
    //   },
    // });

    this.taskResults.push(result);

    return this.taskResults;
  }
}
