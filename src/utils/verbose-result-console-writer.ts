import ConsoleWriter from './console-writer';
import { IResultConsoleWriter } from '../interfaces';

export default class VerboseResultConsoleWriter extends ConsoleWriter
  implements IResultConsoleWriter {
  result: Result;

  constructor(result: Result) {
    super();

    this.result = result;
  }

  write() {
    let writer: ConsoleWriter = new ConsoleWriter();

    writer.line();

    // write default project info
    // writer.heading('Project Information');
    // writer.column({
    //   Name: this.result.name,
    //   Type: this.result.type,
    //   Version: this.result.version,
    // });

    // // write type info
    // writer.line();
    // writer.heading('Types');
    // Object.keys(this.result.types).forEach(type => {
    //   let values = [this.result.types[type].join('\n')];

    //   writer.singleColumnTable(type, values);
    // });

    // // write test info
    // writer.line();
    // writer.heading('Test Modules');
    // Object.keys(this.result.tests).forEach(testType => {
    //   let values = [this.result.tests[testType].join('\n')];

    //   writer.singleColumnTable(testType, values);
    // });

    writer.line();
  }
}
