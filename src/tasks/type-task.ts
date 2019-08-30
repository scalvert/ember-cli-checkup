import { ITask, ICheckupResult, IProject } from '../interfaces';
import Task from '../task';
import FileSearcher from '../utils/file-searcher';

const SEARCH_PATTERNS = {
  controllers: ['**/controllers/**/*.js'],
  routes: ['**/routes/**/*.js'],
  services: ['**/services/**/*.js'],
  components: ['**/components/**/*.js'],
  mixins: ['**/mixins/**/*.js'],
  templates: ['**/templates/**/*.hbs'],
};

export default class TypeTask extends Task implements ITask {
  searcher: FileSearcher;

  constructor(project: IProject, result: ICheckupResult) {
    super(project, result);
    this.searcher = new FileSearcher(this.project.baseDir, SEARCH_PATTERNS);
  }

  async run() {
    let result = await this.searcher.search();

    this.result.types = result;
  }
}
