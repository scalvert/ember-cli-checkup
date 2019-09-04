import { ITask, ICheckupResult, IProject } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';

export default class TypesTask extends FileSearcherTask implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    const SEARCH_PATTERNS = {
      components: ['**/components/**/*.js'],
      controllers: ['**/controllers/**/*.js'],
      helpers: ['**/helpers/**/*.js'],
      mixins: ['**/mixins/**/*.js'],
      models: ['**/models/**/*.js'],
      routes: ['**/routes/**/*.js'],
      services: ['**/services/**/*.js'],
      templates: ['**/templates/**/*.hbs'],
    };

    super(project, result, SEARCH_PATTERNS);
  }

  async run() {
    this.result.types = await this.searcher.search();

    return this.result;
  }
}
