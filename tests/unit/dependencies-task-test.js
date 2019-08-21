const FixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const DependenciesTask = require('../../lib/tasks/dependencies-task').default;
const Result = require('../../lib/result').default;
var module = QUnit.module;
var test = QUnit.test;

module('dependencies-task', function(hooks) {
  let fixturifyProject;
  hooks.beforeEach(function() {
    fixturifyProject = new FixturifyProject('test-app', '0.0.0', project => {
      project.addDevDependency('ember-cli-string-utils', 'latest');
      project.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    });
  });

  test('it detects ember-cli dependencies', async function(assert) {
    let testApp = fixturifyProject.buildProjectModel();
    const dependenciesTaskResult = await new DependenciesTask(testApp, new Result()).run();

    assert.deepEqual(dependenciesTaskResult.emberCliAddons.dependencies, {
      'ember-cli-blueprint-test-helpers': 'latest',
    });
    assert.deepEqual(dependenciesTaskResult.emberCliAddons.devDependencies, {
      'ember-cli-string-utils': 'latest',
    });
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose();
  });
});
