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
      let pkg = project.pkg;

      project.emberAddons = {
        dependencies: getDependencies(pkg.dependencies, 'ember-'),
        devDependencies: getDependencies(pkg.devDependencies, 'ember-'),
      };

      project.emberCliAddons = {
        dependencies: getDependencies(pkg.dependencies, 'ember-cli-'),
        devDependencies: getDependencies(pkg.devDependencies, 'ember-cli-'),
      };

      resolve(this.context);
    });
  }

  writeToOutput() {
    return Promise.resolve();
  }
}

module.exports = CheckEmberAddons;
