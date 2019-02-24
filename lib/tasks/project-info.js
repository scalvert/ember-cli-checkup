const Task = require('../task');
const getProjectType = require('../utils/project').getProjectType;

module.exports = class ProjectInfo extends Task {
  constructor(context, ui) {
    super('Getting Project Information', context, ui);
  }

  run() {
    super.run();
  }

  writeToOutput() {
    return new Promise(resolve => {
      this.ui.writeLine(`Ember ${getProjectType(this.context.project)}`);
      this.ui.writeLine(`Name: ${this.context.project.pkg.name}`);
      this.ui.writeLine(`Version: ${this.context.project.pkg.version}`);

      resolve();
    });
  }
};
