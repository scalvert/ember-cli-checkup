import { ITask, ICheckupResult, IProject } from '../interfaces';
import FileSearcherTask from '../file-searcher-task';

export default class TypeTask extends FileSearcherTask implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    const SEARCH_PATTERNS = {
      controllers: ['**/controllers/**/*.js'],
      routes: ['**/routes/**/*.js'],
      services: ['**/services/**/*.js'],
      components: ['**/components/**/*.js'],
      mixins: ['**/mixins/**/*.js'],
      templates: ['**/templates/**/*.hbs'],
    };

    super(project, result, SEARCH_PATTERNS);
  }

  async run() {
    this.result.types = await this.searcher.search();

    return this.result;
  }
}
