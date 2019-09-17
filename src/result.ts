import {
  ICheckupResult,
  IDependencyList,
  ProjectType,
  ITaskItemData,
  IDictionary,
} from './interfaces';

/**
 * @class Result
 *
 * Comprises the serializable result of all task operations.
 */
export default class Result implements ICheckupResult {
  types!: ITaskItemData;
  tests!: ITaskItemData;
  type!: ProjectType;
  name!: string;
  version!: string;
  emberLibraries!: IDictionary<string>;
  emberAddons!: IDependencyList;
  emberCliAddons!: IDependencyList;

  constructor() {
    this.emberLibraries = {};
  }
}
