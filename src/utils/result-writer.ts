import ConsoleWriter from './console-writer';
import { ITaskResult, IConsoleWriter } from '../interfaces';

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
   *    tasks: [
   *        types: {},
   *        tests: {},
   *        angleBracket: {},
   *        nativeClass: {}
   *      ],
   *    dependencies: {}
   *  }
   *
   */
  toJson() {
    const resultData = {
      tasks: [] as object[],
    };

    this.results.forEach(taskResult => {
      if (
        ['ProjectInfoTaskResult', 'DependenciesTaskResult'].includes(taskResult.constructor.name)
      ) {
        // Adds metadata and dependencies related information
        // to the resultData object
        Object.assign(resultData, taskResult.toJson());
      } else {
        // Adds all other tasks in the `tasks` array if the resultData object
        resultData.tasks.push(taskResult.toJson());
      }
    });

    return resultData;
  }

  writeDuration(duration: string) {
    this.writer.text(`✨ Checkup complete in ${duration}s.`);
    this.writer.line();
  }
}
