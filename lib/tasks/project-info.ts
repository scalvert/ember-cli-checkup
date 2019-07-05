import Task from '../models/task';
import { ITask, ICheckupResult, IProject } from '../../interfaces';
import getProjectType from '../utils/get-project-type';

export default class ProjectInfo extends Task implements ITask {
  constructor(result: ICheckupResult, project: IProject) {
    super('Getting Project Information', project, result);
  }

  run() {
    super.run();

    this.result.project.type = getProjectType(this.project);
    this.result.project.name = this.project.pkg.name;
    this.result.project.version = this.project.pkg.version;
  }
}
