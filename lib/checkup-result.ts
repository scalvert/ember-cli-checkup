import { ICheckupResult, IProjectResult } from '../interfaces';
import ProjectResult from './project-result';

export default class CheckupResult implements ICheckupResult {
  project: IProjectResult;

  constructor() {
    this.project = new ProjectResult();
  }
}
