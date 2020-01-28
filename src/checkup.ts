import { IUserInterface, IProject, ITaskConstructor, IOptions, ITaskResult } from './types';
import { getTaskByName } from './utils/default-tasks';
import TaskList from './task-list';
import * as DefaultTasks from './tasks';
import ResultWriter from './utils/result-writer';
import Clock from './utils/clock';

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

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(
    options: IOptions,
    project: IProject,
    ui: IUserInterface,
    tasks: ITaskConstructor[] = DEFAULT_TASKS
  ) {
    this.options = options;
    this.project = project;
    this.ui = ui;
    this.defaultTasks = tasks;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<ITaskResult[]> {
    let clock = new Clock();
    let tasks = new TaskList(this.project);

    if (this.options.task !== undefined) {
      let task = getTaskByName(this.options.task);

      tasks.addTask(task);
    } else {
      tasks.addTasks(this.defaultTasks);
    }

    clock.start();

    this.ui.startProgress('Hang tight while we check up on your Ember project');

    let taskResults = await tasks.runTasks();

    clock.stop();

    this.ui.stopProgress();

    if (!this.options.silent) {
      let writer = new ResultWriter(taskResults);

      if (this.options.json) {
        console.log(JSON.stringify(writer.toJson(), null, 2));
      } else {
        writer.toConsole();
      }
      writer.writeDuration(clock.duration);
    }

    return taskResults;
  }
}
