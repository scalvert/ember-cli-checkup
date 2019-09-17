import { ITaskResult, IConsoleWriter, ITaskItemData } from '../interfaces';
import getTaskItemTotals from '../utils/get-task-item-totals';

export default class TestsTaskResult implements ITaskResult {
  tests!: ITaskItemData;

  write(writer: IConsoleWriter) {
    writer.heading('Test Modules');
    writer.table(['Test Module Type', 'Total Count'], getTaskItemTotals(this.tests));
    writer.line();
  }
}
