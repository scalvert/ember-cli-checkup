/* eslint-env node */

const TaskList = require('./task-list');
const ProjectInfo = require('./tasks/project-info');
const CheckEmberAddons = require('./tasks/check-ember-addons');

module.exports = class Checkup {
  constructor(options, args, project, ui) {
    this.context = {
      project,
    };
    this.ui = ui;
  }

  run() {
    let tasks = new TaskList(this.context, this.ui);

    // Reading project information
    // - Project name
    // - Version
    tasks.addDefault(ProjectInfo);
    // - ember addons used
    tasks.add(CheckEmberAddons);
    // Determining outdated dependencies
    // Checking Ember types used
    // Checking Test types used

    this.ui.spinner.title = 'Checking up on your Ember project';
    this.ui.spinner.start();

    return tasks
      .run()
      .then(() => {
        this.ui.writeLine('');

        return tasks.write();
      })
      .then(() => {
        this.ui.spinner.stop();
      });
  }
};
