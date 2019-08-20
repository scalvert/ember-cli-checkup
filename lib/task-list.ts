import {
  ITaskList,
  IUserInterface,
  ITask,
  ICheckupResult,
  IProject,
  ITaskConstructor,
} from '../interfaces';
import pMap from 'p-map';

export default class TaskList implements ITaskList {
  run() {
    throw new Error('Method not implemented.');
  }
  write() {
    throw new Error('Method not implemented.');
  }
  private result: ICheckupResult;
  private project: IProject;
  private ui: IUserInterface;
  private tasks: ITask[];
  private defaultTasks: ITask[];

  constructor(project: IProject, ui: IUserInterface, result: ICheckupResult) {
    this.project = project;
    this.ui = ui;
    this.result = result;
    this.defaultTasks = [];
    this.tasks = [];
  }

  addDefault(taskConstructor: ITaskConstructor) {
    this.defaultTasks.push(new taskConstructor(this.project, this.result));
  }

  addDefaults(taskConstructors: ITaskConstructor[]) {
    taskConstructors.forEach((taskConstructor: ITaskConstructor) => {
      this.addDefault(taskConstructor);
    });
  }

  add(ctor: ITaskConstructor) {
    this.tasks.push(new ctor(this.project, this.result));
  }

  runTasks() {
    this.ui.spinner.title = 'Gathering information about your project';
    return this._eachTask((task: ITask) => {
      return task.run();
    });
  }

  _eachTask(fn: (task: ITask) => void) {
    return pMap([...this.defaultTasks, ...this.tasks], fn).then(() => this.result);
  }
}
