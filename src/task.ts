import { ITask, IProject, ITaskResult } from './interfaces';

/**
 * @class Task
 * @implements ITask
 *
 * An checkup task used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class Task implements ITask {
  project: IProject;

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param result {ITaskResult[]} the results object that aggregates data together for output.
   */
  constructor(project: IProject) {
    this.project = project;
  }

  abstract run(): Promise<ITaskResult>;
}
