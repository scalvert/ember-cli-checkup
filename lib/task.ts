import { ITask, IProject, ICheckupResult } from '../interfaces';

export default abstract class Task implements ITask {
  project: IProject;
  result: ICheckupResult;

  constructor(project: IProject, result: ICheckupResult) {
    this.project = project;
    this.result = result;
  }

  run() {}
}
