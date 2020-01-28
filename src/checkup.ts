import { IUserInterface, IProject, ITaskConstructor, IOptions, ITaskResult } from './types';
import { getTaskByName, getTaskNames } from './utils/default-tasks';
import TaskList from './task-list';
import * as DefaultTasks from './tasks';
import ResultWriter from './utils/result-writer';
import Clock from './utils/clock';
import ConsoleWriter from './utils/console-writer';

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
  clock: Clock;
  console: ConsoleWriter;

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
    this.clock = new Clock();
    this.console = new ConsoleWriter();
  }

  /**
   * @method run
   *
   * Entry point for running checkup based on provided options.
   */
  async run(): Promise<ITaskResult[]> {
    this.clock.start();

    if (this.options.listTasks) {
      let taskNames: string[] = getTaskNames();

      this.console.heading('Available Tasks');
      this.console.text(taskNames.join('\n'));
      this.clock.stop();

      this.console.line();
      this.console.text(this.clock.duration);
      this.console.line();

      return Promise.resolve([]);
    }

    return this.runTasks();
  }

  /**
   * @method
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async runTasks() {
    let tasks = new TaskList(this.project);

    if (this.options.task !== undefined) {
      let task = getTaskByName(this.options.task);

      tasks.addTask(task);
    } else {
      tasks.addTasks(this.defaultTasks);
    }

    this.ui.startProgress('Hang tight while we check up on your Ember project');

    let taskResults = await tasks.runTasks();

    this.clock.stop();

    this.ui.stopProgress();

    if (!this.options.silent) {
      let writer = new ResultWriter(taskResults);

      if (this.options.json) {
        this.console.text(JSON.stringify(writer.toJson(), null, 2));
      } else {
        writer.toConsole();
      }
      this.console.text(this.clock.duration);
      this.console.line();
    }

    return taskResults;
  }
}
