export default {};

export interface IDictionary<T> {
  [key: string]: T;
}

export interface IEmberCLICommand {
  project?: any;
  ui?: any;
}

export interface ICommand extends IEmberCLICommand {
  name: string;
  aliases: string[];
  description: string;
  works: string;
  availableOptions: object[];
  run: (options: object) => {};
}

export interface IOptions {
  verbose?: boolean;
  silent?: boolean;
}

export interface IProject {
  baseDir: string;
  pkg: {
    name: string;
    version: string;
    keywords: string[];
    dependencies: IDictionary<string>;
    devDependencies: IDictionary<string>;
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
  dependencies: IDictionary<string>;
  devDependencies: IDictionary<string>;
}

export interface ICheckupResult {
  types: ITaskItemData;
  tests: ITaskItemData;
  type: ProjectType;
  name: string;
  version: string;
  emberLibraries: IDictionary<string>;
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

export type SearchPatterns = IDictionary<string[]>;

export interface IResultConsoleWriter {
  write: () => void;
}
