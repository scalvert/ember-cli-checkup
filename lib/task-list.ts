import { ITaskList, IUserInterface, ITask, ICheckupResult, IProject } from '../interfaces';
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

  addDefault(ctor: any) {
    this.defaultTasks.push(new ctor(this.project, this.result));
  }

  add(ctor: any) {
    this.tasks.push(new ctor(this.project, this.result));
  }

  runTasks() {
    return this._eachTask((task: ITask) => {
      this.ui.spinner.title = task.title;
      return task.run();
    });
  }

  _eachTask(fn: (task: ITask) => void) {
    return pMap([...this.defaultTasks, ...this.tasks], fn).then(() => this.result);
  }
}
