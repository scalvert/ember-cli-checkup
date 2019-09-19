import { ITask, IProject, ITaskResult } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';
import { TypesTaskResult } from '../results';

export default class TypesTask extends FileSearcherTask implements ITask {
  constructor(project: IProject, result: ITaskResult[]) {
    const SEARCH_PATTERNS = {
      components: ['**/components/**/*.js'],
      controllers: ['**/controllers/**/*.js'],
      helpers: ['**/helpers/**/*.js'],
      initializers: ['**/initializers/**/*.js'],
      'instance-initializers': ['**/instance-initializers/**/*.js'],
      mixins: ['**/mixins/**/*.js'],
      models: ['**/models/**/*.js'],
      routes: ['**/routes/**/*.js'],
      services: ['**/services/**/*.js'],
      templates: ['**/templates/**/*.hbs'],
    };

    super(project, result, SEARCH_PATTERNS);
  }

  async run() {
    let result = new TypesTaskResult();
    result.types = await this.searcher.search();

    this.taskResults.push(result);

    return this.taskResults;
  }
}
