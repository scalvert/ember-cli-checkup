const Task = require('../task');
const Project = require('../project');

class ReadProjectInfo extends Task {
  constructor(context, ui) {
    super('Reading project information', context, ui);
  }

  run() {
    super.run();

    return new Promise(resolve => {
      this.context.project = new Project(process.cwd());

      setTimeout(() => {
        resolve(this.context);
      }, 5000);
    });
  }
}

module.exports = ReadProjectInfo;
