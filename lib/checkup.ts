import { IUserInterface, IProject, ICheckupResult } from '../interfaces';
import CheckupResult from './checkup-result';
import TaskList from './task-list';
import ProjectInfo from './tasks/project-info';
import CheckEmberAddons from './tasks/check-ember-addons';

export default class Checkup {
  project: IProject;
  ui: IUserInterface;

  constructor(project: IProject, ui: IUserInterface) {
    this.project = project;
    this.ui = ui;
  }

  async run(): Promise<ICheckupResult> {
    let checkupResult: ICheckupResult = new CheckupResult();
    let tasks = new TaskList(this.project, this.ui, checkupResult);

    tasks.addDefault(ProjectInfo);
    tasks.add(CheckEmberAddons);

    this.ui.spinner.title = 'Hang tight while we check up on your Ember project';
    this.ui.spinner.start();

    let result = await tasks.runTasks();
    this.ui.spinner.stop();

    console.log(JSON.stringify(result, null, 2));

    return result;
  }
}
