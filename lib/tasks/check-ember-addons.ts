import CheckupResult from '../checkup-result';
import { IProject } from '../../interfaces';
import Task from '../task';

function getDependency(dependencies: { [key: string]: string }, key: string) {
  return [key, dependencies[key]];
}

function getDependencies(
  dependencies: { [key: string]: string },
  filter: (dependency: string) => boolean
) {
  return Object.entries(dependencies).reduce((orig: { [key: string]: string }, pair) => {
    let [key, value] = pair;

    if (filter(key)) {
      orig[key] = value;
    }

    return orig;
  }, {});
}

function emberAddonFilter(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}

function emberCliAddonFilter(dependency: string) {
  return dependency.startsWith('ember-cli');
}

export default class CheckEmberAddons extends Task {
  constructor(project: IProject, result: CheckupResult) {
    super(project, result);
  }

  run() {
    super.run();

    return new Promise(resolve => {
      let project = this.project;
      let pkg = project.pkg;

      this.result.project.emberLibraries['ember-source'] = getDependency(
        pkg.devDependencies,
        'ember-source'
      );
      this.result.project.emberLibraries['ember-cli'] = getDependency(
        pkg.devDependencies,
        'ember-cli'
      );
      this.result.project.emberLibraries['ember-data'] = getDependency(
        pkg.devDependencies,
        'ember-data'
      );
      this.result.project.emberAddons = {
        dependencies: getDependencies(pkg.dependencies, emberAddonFilter),
        devDependencies: getDependencies(pkg.devDependencies, emberAddonFilter),
      };

      this.result.project.emberCliAddons = {
        dependencies: getDependencies(pkg.dependencies, emberCliAddonFilter),
        devDependencies: getDependencies(pkg.devDependencies, emberCliAddonFilter),
      };

      resolve(this.result);
    });
  }
}
