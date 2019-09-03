import FixturifyProject = require('fixturify-project');
import { IProject } from '../../../../src/interfaces';

interface EmberCLIFixturifyProject extends FixturifyProject {
  addAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;
  buildProjectModel(): IProject;
  dispose: (filepath?: string) => void;
}

/* eslint-disable no-undef */
export = EmberCLIFixturifyProject;
