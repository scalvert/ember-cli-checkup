import ConsoleWriter from './console-writer';
import Result from '../result';
import { ITaskItemData, IResultConsoleWriter } from '../interfaces';

function getTaskItemTotals(data: ITaskItemData) {
  return Object.keys(data).reduce((total: { [key: string]: number }, type: string) => {
    total[type] = data[type].length;

    return total;
  }, {});
}

export default class ResultConsoleWriter extends ConsoleWriter implements IResultConsoleWriter {
  result: Result;

  constructor(result: Result) {
    super();

    this.result = result;
  }

  write() {
    let writer: ConsoleWriter = new ConsoleWriter();

    writer.line();

    // write default project info
    writer.heading('Project Information');
    writer.column({
      Name: this.result.name,
      Type: this.result.type,
      Version: this.result.version,
    });

    // write type info
    writer.line();
    writer.heading('Types');
    writer.column(getTaskItemTotals(this.result.types));

    // write test info
    writer.line();
    writer.heading('Test Modules');
    writer.column(getTaskItemTotals(this.result.tests));

    writer.line();
  }
}
