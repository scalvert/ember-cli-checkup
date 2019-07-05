import { ITask, ICheckupResult, IProject } from '../../interfaces';

export default abstract class Task implements ITask {
  title: string;
  project: IProject;
  result: ICheckupResult;

  constructor(title: string, project: IProject, result: ICheckupResult) {
    this.title = title;
    this.project = project;
    this.result = result;
  }

  run() {}
}
