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
  taskResults: ITaskResult[];

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param result {ITaskResult[]} the results object that aggregates data together for output.
   */
  constructor(project: IProject, taskResults: ITaskResult[]) {
    this.project = project;

    // TODO: need to revist "why" we need to pass in the taskResults rather than using the result of `run`
    // ! This can cause rest result leakage between tests, i.e. any subsequent test can modify the restulf of a prior test (malicious or not)
    this.taskResults = taskResults;
  }

  run() {}
}
