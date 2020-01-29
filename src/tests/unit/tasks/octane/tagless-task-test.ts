import TaglessTask from '../../../../tasks/octane/tagless-task';
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const DisposableFixturifyProject = require('../../../helpers/DisposableFixturifyProject');

const { test } = QUnit;

const FILE_PATH = 'test-app';

QUnit.module('Octane | Tagless Task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it should default to fully converted if nothing is found', async function(assert) {
    fixturifyProject.writeSync(FILE_PATH);

    const project = fixturifyProject.buildProjectModel();
    const result = await new TaglessTask(project).run();

    const {
      basic: { percentage },
    } = result;

    assert.equal(percentage, 100, 'percentage is 100%');
  });

  // test('', async function(assert) {
  //   fixturifyProject.files = Object.assign(fixturifyProject.files, {
  //     components: {},
  //     templates: {},
  //   });

  //   fixturifyProject.writeSync(FILE_PATH);

  //   const project = fixturifyProject.buildProjectModel();
  //   const result = await new TaglessTask(project).run();
  // });
});
