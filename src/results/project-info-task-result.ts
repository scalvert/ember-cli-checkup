import { ITaskResult, IConsoleWriter } from '../interfaces';

export default class ProjectInfoTaskResult implements ITaskResult {
  type!: string;
  name!: string;
  version!: string;

  write(writer: IConsoleWriter) {
    writer.heading('Project Information');
    writer.column({
      Name: this.name,
      Type: this.type,
      Version: this.version,
    });
    writer.line();
  }
}
