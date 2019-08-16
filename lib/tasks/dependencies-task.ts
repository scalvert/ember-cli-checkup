import { IProject, ICheckupResult, ITask } from '../../interfaces';
import Task from '../task';

function getDependency(dependencies: { [key: string]: string }, key: string): string {
  return dependencies[key];
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

export default class DependenciesTask extends Task implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    super(project, result);
  }

  run() {
    return new Promise(resolve => {
      let project = this.project;
      let pkg = project.pkg;

      this.result.emberLibraries['ember-source'] = getDependency(
        pkg.devDependencies,
        'ember-source'
      );
      this.result.emberLibraries['ember-cli'] = getDependency(pkg.devDependencies, 'ember-cli');
      this.result.emberLibraries['ember-data'] = getDependency(pkg.devDependencies, 'ember-data');
      this.result.emberAddons = {
        dependencies: getDependencies(pkg.dependencies, emberAddonFilter),
        devDependencies: getDependencies(pkg.devDependencies, emberAddonFilter),
      };

      this.result.emberCliAddons = {
        dependencies: getDependencies(pkg.dependencies, emberCliAddonFilter),
        devDependencies: getDependencies(pkg.devDependencies, emberCliAddonFilter),
      };

      resolve(this.result);
    });
  }
}
