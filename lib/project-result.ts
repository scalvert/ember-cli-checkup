import { IProjectResult, ProjectType } from '../interfaces';

interface DependencyList {
  dependencies: string[];
  devDependencies: string[];
}

export default class ProjectResult implements IProjectResult {
  type!: ProjectType;
  name!: string;
  version!: string;
  emberLibraries!: { [key: string]: string };
  emberAddons!: DependencyList;
  emberCliAddon!: DependencyList;

  constructor() {
    this.emberLibraries = {};
  }
}
