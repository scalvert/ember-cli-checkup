import FixturifyProject = require('fixturify-project');
import { IProject } from '../../../../src/types';

interface EmberCLIFixturifyProject extends FixturifyProject {
  addAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  addDevAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  addInRepoAddon(
    name: string,
    version: string,
    callback?: (project: FixturifyProject) => void
  ): FixturifyProject;

  buildProjectModel(ProjectClass?: new () => IProject): IProject;
  dispose: (filepath?: string) => void;
}

/* eslint-disable no-undef */
export = EmberCLIFixturifyProject;
