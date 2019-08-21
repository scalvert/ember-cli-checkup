import FixturifyProject = require('fixturify-project');
import { IProject } from '../../../../interfaces';

interface EmberCLIFixturifyProject extends FixturifyProject {
  addAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;
  buildProjectModel(): IProject;
}

/* eslint-disable no-undef */
export = EmberCLIFixturifyProject;
