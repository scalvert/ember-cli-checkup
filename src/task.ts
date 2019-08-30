import { ITask, IProject, ICheckupResult } from './interfaces';

/**
 * @class Task
 * @implements ITask
 *
 * An checkup task used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class Task implements ITask {
  project: IProject;
  result: ICheckupResult;

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param result {ICheckupResult} the result object that aggregates data together for output.
   */
  constructor(project: IProject, result: ICheckupResult) {
    this.project = project;
    this.result = result;
  }

  run() {}
}
