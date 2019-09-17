import { IProject, ITask, IDictionary, ITaskResult } from '../interfaces';
import Task from '../task';
import { DependenciesTaskResult } from '../results';

function getDependency(dependencies: IDictionary<string>, key: string): string {
  return dependencies[key];
}

function getDependencies(
  dependencies: IDictionary<string>,
  filter: (dependency: string) => boolean
) {
  return Object.entries(dependencies).reduce((orig: IDictionary<string>, pair) => {
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
  constructor(project: IProject, result: ITaskResult[]) {
    super(project, result);
  }

  async run() {
    let result = new DependenciesTaskResult();
    let project = this.project;
    let pkg = project.pkg;

    result.emberLibraries['ember-source'] = getDependency(pkg.devDependencies, 'ember-source');
    result.emberLibraries['ember-cli'] = getDependency(pkg.devDependencies, 'ember-cli');
    result.emberLibraries['ember-data'] = getDependency(pkg.devDependencies, 'ember-data');
    result.emberAddons = {
      dependencies: getDependencies(pkg.dependencies, emberAddonFilter),
      devDependencies: getDependencies(pkg.devDependencies, emberAddonFilter),
    };

    result.emberCliAddons = {
      dependencies: getDependencies(pkg.dependencies, emberCliAddonFilter),
      devDependencies: getDependencies(pkg.devDependencies, emberCliAddonFilter),
    };

    this.taskResults.push(result);

    return this.taskResults;
  }
}
