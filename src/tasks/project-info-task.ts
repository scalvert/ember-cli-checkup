import { ITask, IProject, ITaskResult } from '../interfaces';
import Task from '../task';
import { ProjectInfoTaskResult } from '../results';
import getProjectType from '../utils/get-project-type';

export default class ProjectInfoTask extends Task implements ITask {
  constructor(project: IProject, result: ITaskResult[]) {
    super(project, result);
  }

  run() {
    let result = new ProjectInfoTaskResult();
    result.type = getProjectType(this.project);
    result.name = this.project.pkg.name;
    result.version = this.project.pkg.version;

    this.taskResults.push(result);

    return this.taskResults;
  }
}
