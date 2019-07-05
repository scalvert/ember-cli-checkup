import { IProjectResult, ProjectType } from '../../interfaces';

export default class ProjectResult implements IProjectResult {
  type!: ProjectType;
  name!: string;
  version!: string;
}
