import { ICheckupResult, IDependencyList, ProjectType } from '../interfaces';

export default class Result implements ICheckupResult {
  types!: any[];
  type!: ProjectType;
  name!: string;
  version!: string;
  emberLibraries!: { [key: string]: string };
  emberAddons!: IDependencyList;
  emberCliAddons!: IDependencyList;

  constructor() {
    this.emberLibraries = {};
  }
}
