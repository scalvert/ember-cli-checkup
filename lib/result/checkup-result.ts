import { ICheckupResult, IProjectResult } from '../../interfaces';

export default class CheckupResult implements ICheckupResult {
  project!: IProjectResult;
}
