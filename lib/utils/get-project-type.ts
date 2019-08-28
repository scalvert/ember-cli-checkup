import * as fs from 'fs';
import * as path from 'path';
import { IProject, ProjectType } from '../../interfaces';

/**
 * Gets the current type of project, either
 * @param project {IProject} The ember-cli model object, either App, Engine, or Addon.
 * @returns {ProjectType}
 */
export default function getProjectType(project: IProject): ProjectType {
  let pkg = project.pkg;

  if (pkg.keywords && Array.isArray(pkg.keywords) && pkg.keywords.indexOf('ember-addon') >= 0) {
    if (fs.existsSync(path.join(project.root, 'addon', 'engine.js'))) {
      return ProjectType.Engine;
    } else {
      return ProjectType.Addon;
    }
  } else if (
    (pkg.dependencies && Object.keys(pkg.dependencies).includes('ember-cli')) ||
    (pkg.devDependencies && Object.keys(pkg.devDependencies).includes('ember-cli'))
  ) {
    return ProjectType.App;
  }

  return ProjectType.Unknown;
}
