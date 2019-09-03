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
  baseDir: string;
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
  writeLine: (line: string) => void;
  startProgress: (message: string) => void;
  stopProgress: () => void;
}

export interface IDependencyList {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
}

export interface ICheckupResult {
  types: ITaskItemData;
  tests: ITaskItemData;
  type: ProjectType;
  name: string;
  version: string;
  emberLibraries: { [key: string]: string };
  emberAddons: IDependencyList;
  emberCliAddons: IDependencyList;
}

export interface ITaskItemData {
  [propName: string]: string[];
}
export interface ITaskList {
  add: (task: ITaskConstructor) => void;
  addDefault: (task: ITaskConstructor) => void;
  runTasks: () => void;
}

export interface ITask {
  result: ICheckupResult;
  run: () => void;
}

export interface ITaskConstructor {
  new (project: IProject, result: ICheckupResult): ITask;
}

export type SearchPatterns = { [key: string]: string[] };
