import { ITask, ICheckupResult, IProject } from '../../interfaces';
import Task from '../task';
import getProjectType from '../utils/get-project-type';

export default class ProjectInfoTask extends Task implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    super(project, result);
  }

  run() {
    this.result.type = getProjectType(this.project);
    this.result.name = this.project.pkg.name;
    this.result.version = this.project.pkg.version;
  }
}
