export default {};

export interface IEmberCLICommand {
  project?: any;
  ui?: any;
}

export interface ICommand extends IEmberCLICommand {
  name: string;
  description: string;
  works: string;
  run: () => {};
}

export interface IProject {
  pkg: {
    name: string;
    version: string;
    keywords: string[];
    dependencies: { [key: string]: string };
    devDependencies: { [key: string]: string };
  };
  root: string;
}

export const enum ProjectType {
  App = 'application',
  Addon = 'addon',
  Engine = 'engine',
  Unknown = 'unknown',
}

export interface ISpinner {
  title: string;
  start: () => void;
  stop: () => void;
}

export interface IUserInterface {
  spinner: ISpinner;
  writeLine: (line: string) => void;
}

export interface ICheckupResult {
  project: any;
}

export interface IProjectResult {
  type: ProjectType;
  name: string;
  version: string;
}

export interface ITaskList {
  add: (task: ITask) => void;
  addDefault: (task: ITask) => void;
  runTasks: () => void;
}

export interface ITask {
  title: string;
  result: ICheckupResult;
  run: () => void;
}
