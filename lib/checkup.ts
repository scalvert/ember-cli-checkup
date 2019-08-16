import { IUserInterface, IProject, ICheckupResult, ITaskConstructor } from '../interfaces';
import Result from './result';
import TaskList from './task-list';
import * as Tasks from './tasks';

export default class Checkup {
  project: IProject;
  ui: IUserInterface;

  constructor(project: IProject, ui: IUserInterface) {
    this.project = project;
    this.ui = ui;
  }

  async run(): Promise<ICheckupResult> {
    let checkupResult: ICheckupResult = new Result();
    let tasks = new TaskList(this.project, this.ui, checkupResult);
    let defaultTaskConstructors = <ITaskConstructor[]>Object.values(Tasks);

    tasks.addDefaults(defaultTaskConstructors);

    this.ui.spinner.title = 'Hang tight while we check up on your Ember project';
    this.ui.spinner.start();

    let result = await tasks.runTasks();

    this.ui.spinner.stop();

    console.log(JSON.stringify(result, null, 2));

    return result;
  }
}
