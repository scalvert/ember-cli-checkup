import { IUserInterface, IProject, ICheckupResult, ITaskConstructor } from '../interfaces';
import Result from './result';
import TaskList from './task-list';
import * as Tasks from './tasks';

/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  project: IProject;
  ui: IUserInterface;

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(project: IProject, ui: IUserInterface) {
    this.project = project;
    this.ui = ui;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<ICheckupResult> {
    let checkupResult: ICheckupResult = new Result();
    let tasks = new TaskList(this.project, this.ui, checkupResult);
    let defaultTaskConstructors = <ITaskConstructor[]>Object.values(Tasks);

    tasks.addDefaults(defaultTaskConstructors);

    this.ui.startProgress('Hang tight while we check up on your Ember project');

    let result = await tasks.runTasks();

    this.ui.stopProgress();

    console.log(JSON.stringify(result, null, 2));

    return result;
  }
}
