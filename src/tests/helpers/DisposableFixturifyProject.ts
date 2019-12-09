const FixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const rimraf = require('rimraf');

module.exports = class DisposableFixturifyProject extends FixturifyProject {
  /**
   * If a tempFilesToCleanupPath exists, then remove the directory synchronously, else
   * execute the default dispose behavior of the parent.
   * @param filepath
   */
  dispose(tempFilesToCleanupPath?: string) {
    super.dispose();

    if (tempFilesToCleanupPath) {
      rimraf.sync(tempFilesToCleanupPath);
    }
  }
};
