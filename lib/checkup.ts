import { IUserInterface, IProject, ICheckupResult, ITaskConstructor } from '../interfaces';
import Result from './result';
import TaskList from './task-list';
import * as DefaultTasks from './tasks';

const DEFAULT_TASKS = <ITaskConstructor[]>Object.values(DefaultTasks);

/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  project: IProject;
  ui: IUserInterface;
  defaultTasks: ITaskConstructor[];
  result: ICheckupResult;

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(
    project: IProject,
    ui: IUserInterface,
    tasks: ITaskConstructor[] = DEFAULT_TASKS,
    result = new Result()
  ) {
    this.project = project;
    this.ui = ui;
    this.defaultTasks = tasks;
    this.result = result;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<ICheckupResult> {
    let tasks = new TaskList(this.project, this.result);
    let defaultTaskConstructors = this.defaultTasks;

    tasks.addDefaults(defaultTaskConstructors);

    this.ui.startProgress('Hang tight while we check up on your Ember project');

    let result = await tasks.runTasks();

    this.ui.stopProgress();

    console.log(JSON.stringify(result, null, 2));

    return result;
  }
}
