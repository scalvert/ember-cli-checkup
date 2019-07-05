import CheckupResult from '../result/checkup-result';
import { IProject } from '../../interfaces';
import Task from '../models/task';

function getDependencies(dependencies: { [key: string]: string }, filter: string) {
  return Object.keys(dependencies || {}).filter(dependency => dependency.startsWith(filter));
}

export default class CheckEmberAddons extends Task {
  constructor(project: IProject, result: CheckupResult) {
    super('Checking ember addons used', project, result);
  }

  run() {
    super.run();

    return new Promise(resolve => {
      let project = this.result.project;
      let pkg = project.pkg;

      project.emberAddons = {
        dependencies: getDependencies(pkg.dependencies, 'ember-'),
        devDependencies: getDependencies(pkg.devDependencies, 'ember-'),
      };

      project.emberCliAddons = {
        dependencies: getDependencies(pkg.dependencies, 'ember-cli-'),
        devDependencies: getDependencies(pkg.devDependencies, 'ember-cli-'),
      };

      resolve(this.result);
    });
  }
}
