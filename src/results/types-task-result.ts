import { ITaskResult, IConsoleWriter, ITaskItemData } from '../interfaces';
import getTaskItemTotals from '../utils/get-task-item-totals';

export default class TypesTaskResult implements ITaskResult {
  types!: ITaskItemData;

  write(writer: IConsoleWriter) {
    writer.heading('Types');
    writer.table(['Type', 'Total Count'], getTaskItemTotals(this.types));
    writer.line();
  }
}
