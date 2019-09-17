import ConsoleWriter from './console-writer';
import { IResultConsoleWriter, ITaskResult } from '../interfaces';

export default class ResultConsoleWriter implements IResultConsoleWriter {
  results: ITaskResult[];

  constructor(results: ITaskResult[]) {
    this.results = results;
  }

  write() {
    let writer: ConsoleWriter = new ConsoleWriter();

    writer.line();

    this.results.forEach(result => {
      result.write(writer);
    });
  }
}
