const Task = require('../task');

function getDependencies(dependencies, filter) {
  return Object.keys(dependencies || {}).filter(dependency =>
    dependency.startsWith(filter)
  );
}

class CheckEmberAddons extends Task {
  constructor(context, ui) {
    super('Checking ember addons used', context, ui);
  }

  run() {
    super.run();

    return new Promise(resolve => {
      let project = this.context.project;

      project.dependencies = {
        emberAddons: getDependencies(
          project.packageJson.dependencies,
          'ember-'
        ),
        emberCliAddons: getDependencies(
          project.packageJson.dependencies,
          'ember-cli-'
        ),
      };

      project.devDependencies = {
        emberAddons: getDependencies(
          project.packageJson.devDependencies,
          'ember-'
        ),
        emberCliAddons: getDependencies(
          project.packageJson.devDependencies,
          'ember-cli-'
        ),
      };

      resolve(this.context);
    });
  }
}

module.exports = CheckEmberAddons;
