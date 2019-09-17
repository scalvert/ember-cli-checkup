// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const FixturifyProject = require('ember-cli/tests/helpers/fixturify-project');

import { DependenciesTask } from '../../tasks';
import { DependenciesTaskResult } from '../../results';

const { test } = QUnit;

QUnit.module('dependencies-task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new FixturifyProject('test-app', '0.0.0', (project: IFixturifyProject) => {
      project.addDevDependency('ember-cli-string-utils', 'latest');
      project.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    });
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose();
  });

  test('it detects ember-cli dependencies', async function(assert) {
    let project = fixturifyProject.buildProjectModel();
    const results = await new DependenciesTask(project, []).run();
    const dependencyTaskResult = <DependenciesTaskResult>results.pop();

    assert.deepEqual(dependencyTaskResult.emberCliAddons.dependencies, {
      'ember-cli-blueprint-test-helpers': 'latest',
    });
    assert.deepEqual(dependencyTaskResult.emberCliAddons.devDependencies, {
      'ember-cli-string-utils': 'latest',
    });
  });
});
