import { ITask, IProject, ITaskResult } from '../types';
import Task from '../task';
import { ProjectInfoTaskResult } from '../results';
import getProjectType from '../utils/get-project-type';

export default class ProjectInfoTask extends Task implements ITask {
  constructor(project: IProject) {
    super(project);
  }

  async run(): Promise<ITaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult();
    result.type = getProjectType(this.project);
    result.name = this.project.pkg.name;
    result.version = this.project.pkg.version;

    return result;
  }
}
