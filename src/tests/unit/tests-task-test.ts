// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
import { TestsTask } from '../../tasks';
import { TestsTaskResult } from '../../results';
const EmberCheckupFixturifyProject = require('../helpers/EmberCheckupFixturifyProject');

var module = QUnit.module;
const test = QUnit.test;

const FILE_PATH = 'tests/testApp';

module('tests-task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new EmberCheckupFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it returns all the test files found in the app', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      tests: {
        unit: {
          'foo-unit-test.js': 'unit test 1',
          'bar-unit-test.js': 'unit test 2',
        },
        acceptance: {
          'foo-acceptance-test.js': 'acceptance test',
        },
        integration: {
          'foo-integration-test.js': 'integration test',
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const taskResults = await new TestsTask(project, []).run();
    const testsTaskResult = <TestsTaskResult>taskResults.pop();

    assert.equal(Object.keys(testsTaskResult.tests).length, 3);
    assert.equal(testsTaskResult.tests.unit.length, 2);
    assert.equal(testsTaskResult.tests.acceptance.length, 1);
    assert.equal(testsTaskResult.tests.integration.length, 1);
  });

  test('it returns all the nested test files found in the app', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      mobile: {
        tests: {
          unit: {
            'mobile-foo-unit-test.js': 'mobile unit test',
          },
          acceptance: {
            'mobile-foo-acceptance-test.js': 'mobile acceptance test',
          },
        },
      },
      tests: {
        unit: {
          'foo-unit-test.js': 'unit test 1',
          'bar-unit-test.js': 'unit test 2',
        },
        acceptance: {
          'foo-acceptance-test.js': 'acceptance test',
        },
        integration: {
          'foo-integration-test.js': 'integration test',
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const taskResults = await new TestsTask(project, []).run();
    const testsTaskResult = <TestsTaskResult>taskResults.pop();

    assert.equal(Object.keys(testsTaskResult.tests).length, 3);
    assert.equal(testsTaskResult.tests.unit.length, 3);
    assert.equal(testsTaskResult.tests.acceptance.length, 2);
    assert.equal(testsTaskResult.tests.integration.length, 1);
  });
});
