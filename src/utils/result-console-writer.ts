import ConsoleWriter from './console-writer';
import Result from '../result';
import { ITaskItemData, IResultConsoleWriter, IDictionary } from '../interfaces';

function getTaskItemTotals(data: ITaskItemData): IDictionary<number> {
  return Object.keys(data).reduce((total: IDictionary<number>, type: string) => {
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
    writer.line();

    writer.heading('Depedencies');
    writer.table('Ember Core Libraries', this.result.emberLibraries);
    writer.line();

    writer.table('Ember Addons', this.result.emberAddons.dependencies);
    writer.table('Ember CLI Addons', this.result.emberCliAddons.dependencies);
    writer.line();

    // write type info
    writer.heading('Types');
    writer.table(['Type', 'Total Count'], getTaskItemTotals(this.result.types));
    writer.line();

    // write test info
    writer.heading('Test Modules');
    writer.table(['Test Module Type', 'Total Count'], getTaskItemTotals(this.result.tests));
    writer.line();
  }
}
