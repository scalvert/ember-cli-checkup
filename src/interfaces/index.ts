import { TraverseOptions } from "@babel/traverse";

// import { File } from '@babel/types';

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

export interface IConsoleWriter {
  heading: (heading: string) => void;
  divider: () => void;
  text: (text: string) => void;
  indent: (spaces: number) => void;
  line: () => void;
  column: <T>(data: IDictionary<T>) => void;
  table: <T>(heading: string[] | string, dict: IDictionary<T>) => void;
  singleColumnTable: (heading: string, rowData: string[]) => void;
}

export interface ITaskResult {
  write: (writer: IConsoleWriter) => void;
}

export interface ITaskItemData {
  [propName: string]: string[];
}

export interface ITaskList {
  addTask: (task: ITaskConstructor) => void;
  addTasks: (tasks: ITaskConstructor[]) => void;
  runTasks: () => void;
}

export interface ITask {
  taskResults: ITaskResult[];
  run: () => void;
}

export interface ITaskConstructor {
  new (project: IProject, results: ITaskResult[]): ITask;
}

export type SearchPatterns = IDictionary<string[]>;

export interface IASTSearchResult {
  filePath: string;
}

export interface ISearchVisitor {
  results: IASTSearchResult[];
  visitors: TraverseOptions
}

export interface IResultConsoleWriter {
  write: () => void;
}
