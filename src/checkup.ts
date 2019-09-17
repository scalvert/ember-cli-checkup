import { IUserInterface, IProject, ITaskConstructor, IOptions, ITaskResult } from './interfaces';
import TaskList from './task-list';
import * as DefaultTasks from './tasks';
import ResultConsoleWriter from './utils/result-console-writer';

const DEFAULT_TASKS = <ITaskConstructor[]>(
  Object.values(DefaultTasks).filter(x => typeof x == 'function')
);
/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  options: IOptions;
  project: IProject;
  ui: IUserInterface;
  defaultTasks: ITaskConstructor[];
  result: ITaskResult[];

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(
    options: IOptions,
    project: IProject,
    ui: IUserInterface,
    tasks: ITaskConstructor[] = DEFAULT_TASKS,
    results = []
  ) {
    this.options = options;
    this.project = project;
    this.ui = ui;
    this.defaultTasks = tasks;
    this.result = results;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<ITaskResult[]> {
    let tasks = new TaskList(this.project, this.result);
    let defaultTaskConstructors = this.defaultTasks;

    tasks.addDefaults(defaultTaskConstructors);

    this.ui.startProgress('Hang tight while we check up on your Ember project');

    let taskResults = await tasks.runTasks();

    this.ui.stopProgress();

    if (!this.options.silent) {
      let writer = new ResultConsoleWriter(taskResults);

      writer.write();
    }

    return taskResults;
  }
}
