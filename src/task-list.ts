import { ITaskList, ITask, ICheckupResult, IProject, ITaskConstructor } from './interfaces';
import * as pMap from 'p-map';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList implements ITaskList {
  run() {
    throw new Error('Method not implemented.');
  }
  write() {
    throw new Error('Method not implemented.');
  }
  private result: ICheckupResult;
  private project: IProject;
  private tasks: ITask[];
  private defaultTasks: ITask[];

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   * @param result {ICheckupResult} the result object that aggregates data together for output.
   */
  constructor(project: IProject, result: ICheckupResult) {
    this.project = project;
    this.result = result;
    this.defaultTasks = [];
    this.tasks = [];
  }

  /**
   * @method addDefault
   *
   * Adds a default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {ITaskConstructor} a constructor representing a Task class
   */
  addDefault(taskConstructor: ITaskConstructor) {
    this.defaultTasks.push(new taskConstructor(this.project, this.result));
  }

  /**
   * @method addDefaults
   *
   * Adds an array default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {ITaskConstructor[]} an array of constructors representing a Task classes
   */
  addDefaults(taskConstructors: ITaskConstructor[]) {
    taskConstructors.forEach((taskConstructor: ITaskConstructor) => {
      this.addDefault(taskConstructor);
    });
  }

  /**
   * @method add
   *
   * Adds a task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {ITaskConstructor} a constructor representing a Task class
   */
  add(ctor: ITaskConstructor) {
    this.tasks.push(new ctor(this.project, this.result));
  }

  /**
   * @method runTasks
   *
   * Runs all tasks that have been added to the task list.
   */
  runTasks() {
    return this.eachTask((task: ITask) => {
      return task.run();
    });
  }

  /**
   * @private
   * @method eachTask
   *
   * Runs each task in parallel
   * @param fn {Function} the function expressing the wrapped task to run
   */
  private eachTask(fn: (task: ITask) => void) {
    return pMap([...this.defaultTasks, ...this.tasks], fn).then(() => this.result);
  }
}
