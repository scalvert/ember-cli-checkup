import { IConsoleWriter, ITaskResult, ITestTaskResultData } from '../interfaces';

export default class TestsTaskResult implements ITaskResult {
  data!: ITestTaskResultData;

  write(writer: IConsoleWriter) {
    writer.heading('Implement Me!');
    writer.line();
  }
}
