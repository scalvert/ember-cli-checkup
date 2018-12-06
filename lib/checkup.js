/* eslint-env node */

const TaskList = require('./task-list');
const ReadProjectInfo = require('./tasks/read-project-info');
const CheckEmberAddons = require('./tasks/check-ember-addons');
const writer = require('./output-writer');

module.exports = class Checkup {
  constructor(options, args, ui) {
    this.context = {};
    this.ui = ui;
  }

  run() {
    let tasks = new TaskList(this.context, this.ui);

    // Reading project information
    // - Project name
    // - Version
    tasks.addDefault(ReadProjectInfo);
    // - ember addons used
    tasks.add(CheckEmberAddons);
    // Determining outdated dependencies
    // Checking Ember types used
    // Checking Test types used

    this.ui.spinner.title = 'Checking up on your Ember project';
    this.ui.spinner.start();

    return tasks
      .run()
      .then(context => {
        this.ui.writeLine('');

        return writer.write(context);
      })
      .then(() => {
        this.ui.spinner.stop();
      });
  }
};
