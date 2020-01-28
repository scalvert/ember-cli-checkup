import { IConsoleWriter, ITaskResult } from '../types';

import ConsoleWriter from './console-writer';

export default class ResultWriter {
  results: ITaskResult[];
  writer: IConsoleWriter;

  constructor(results: ITaskResult[], writer: IConsoleWriter = new ConsoleWriter()) {
    this.results = results;
    this.writer = writer;
  }

  toConsole() {
    this.writer.line();

    this.results.forEach(result => {
      result.toConsole(this.writer);
    });
  }

  /**
   * Returns a json object with the project metadata and info of all the tasks that were run.
   * Example output for a project named foo and its 4 tasks:
   *  {
   *    name: 'foo',
   *    version: 'bar',
   *    type: 'baz',
   *    dependencies: {}
   *    types: {},
   *    tests: {},
   *  }
   */
  toJson() {
    let resultData = {};
    this.results.forEach(taskResult => {
      resultData = Object.assign(resultData, taskResult.toJson());
    });

    return resultData;
  }
}
