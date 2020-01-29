import Task from '../../task';
import { ITaskResult, IConsoleWriter } from '../../types';

class TaglessTaskResult implements ITaskResult {
  get basic() {
    const completeCount = this.verbose.complete.length;
    const total = completeCount + this.verbose.incomplete.length;

    if (!total) {
      return {
        percentage: 100,
      };
    }

    return {
      percentage: completeCount / total,
    };
  }

  get verbose() {
    return {
      complete: [],
      incomplete: [],
    };
  }

  toConsole(writer: IConsoleWriter) {
    writer.heading('Implement Me!');
    writer.line();
  }

  toJson() {
    return this.basic;
  }
}

export default class TaglessTask extends Task {
  async run() {
    return new TaglessTaskResult();
  }
}
