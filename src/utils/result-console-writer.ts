import ConsoleWriter from './console-writer';
import { IResultConsoleWriter, ITaskResult, IConsoleWriter } from '../interfaces';

export default class ResultConsoleWriter implements IResultConsoleWriter {
  results: ITaskResult[];
  writer: IConsoleWriter;

  constructor(results: ITaskResult[]) {
    this.results = results;
    this.writer = new ConsoleWriter();
  }

  write() {
    this.writer.line();

    this.results.forEach(result => {
      result.write(this.writer);
    });
  }

  writeDuration(duration: string) {
    this.writer.text(`✨ Checkup complete in ${duration}s.`);
    this.writer.line();
  }
}
