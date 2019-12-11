// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
import { TestsTask } from '../../tasks';
import { TestsTaskResult } from '../../results';
const DisposableFixturifyProject = require('../helpers/DisposableFixturifyProject');

var module = QUnit.module;
const test = QUnit.test;

const FILE_PATH = 'test-app';

/**
 * Test Types:
 * - Application (setupApplicationTest)
 * - Rendering (setupRenderingTest)
 * - Container (setupTest)
 * - Unit (everything else)
 *
 * What we want to track per test type:
 * - Module count
 * - Test count
 * - Skip count
 */

module('tests-task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  // @ts-ignore
  test('it returns correct basic counts', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      tests: {
        unit: {
          controllers: {
            'bar-test.js': `
              import { module, test } from 'qunit';
              import { setupTest } from 'ember-qunit';

              module('Unit | Controller | bar', function(hooks) {
                setupTest(hooks);

                test('baz', function(assert) {
                  assert.ok(true);
                });
                test('biz', function(assert) {
                  assert.ok(true);
                });
              });
            `,
          },
          utils: {
            'foo-test.js': `
              import { module, test } from 'qunit';

              module('Unit | Utils | foo', function() {
                test('bar', function(assert) {
                  assert.ok(true);
                });
                skip('biz', function(assert) {
                  assert.ok(true);
                });
                test('barbiz', function(assert) {
                  assert.ok(true);
                });
              });
            `,
          },
        },
        acceptance: {
          'login-test.js': `
              import { module, test } from 'qunit';
              import { visit, currentURL } from '@ember/test-helpers';
              import { setupApplicationTest } from 'ember-qunit';

              module('Acceptance | login', function(hooks) {
                setupApplicationTest(hooks);

                test('visiting /login', async function(assert) {
                  await visit('/login');
                  assert.equal(currentURL(), '/login');
                });
              });
          `,
        },
        integration: {
          components: {
            'foo-color-test.js': `
              import { module, test } from 'qunit';
              import { setupRenderingTest } from 'ember-qunit';
              import { render } from '@ember/test-helpers';
              import hbs from 'htmlbars-inline-precompile';

              module('Integration | Component | foo-color', function(hooks) {
                setupRenderingTest(hooks);

                test('should change colors', async function(assert) {
                  assert.expect(1);

                  // set the outer context to red
                  this.set('colorValue', 'red');

                  await render(hbs\`<FooColor @name={{this.colorValue}} />\`);

                  assert.equal(
                    this.element.querySelector('div').getAttribute('style'),
                    'color: red',
                    'starts as red'
                  );
                });
              });
            `,
          },
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const taskResults = await new TestsTask(project, []).run();
    const testsTaskResult = <TestsTaskResult>taskResults.pop();

    const {
      data: {
        application: applicationData,
        container: containerData,
        rendering: renderingData,
        unit: unitData,
      },
    } = testsTaskResult;

    assert.equal(applicationData.moduleCount, 1, 'application module count is correct');
    assert.equal(applicationData.skipCount, 0, 'application skip count is correct');
    assert.equal(applicationData.testCount, 1, 'application test count is correct');

    assert.equal(containerData.moduleCount, 1, 'container module count is correct');
    assert.equal(containerData.skipCount, 0, 'container skip count is correct');
    assert.equal(containerData.testCount, 2, 'container test count is correct');

    assert.equal(renderingData.moduleCount, 1, 'rendering module count is correct');
    assert.equal(renderingData.skipCount, 0, 'rendering skip count is correct');
    assert.equal(renderingData.testCount, 1, 'rendering test count is correct');

    assert.equal(unitData.moduleCount, 1, 'unit module count is correct');
    assert.equal(unitData.skipCount, 1, 'unit skip count is correct');
    assert.equal(unitData.testCount, 2, 'unit test count is correct');
  });

  // test('it returns all the nested test files found in the app', async function(assert) {
  //   fixturifyProject.addInRepoAddon('foo-bar', '0.0.1', function(addonProject: IFixturifyProject) {
  //     addonProject.files = Object.assign(addonProject.files, {
  //       tests: {
  //         unit: {
  //           'mobile-foo-unit-test.js': 'mobile unit test',
  //         },
  //         acceptance: {
  //           'mobile-foo-acceptance-test.js': 'mobile acceptance test',
  //         },
  //       },
  //     });
  //   });

  //   fixturifyProject.files = Object.assign(fixturifyProject.files, {
  //     'index.js': 'index js file',
  //     tests: {
  //       unit: {
  //         'foo-unit-test.js': 'unit test 1',
  //         'bar-unit-test.js': 'unit test 2',
  //       },
  //       acceptance: {
  //         'foo-acceptance-test.js': 'acceptance test',
  //       },
  //       integration: {
  //         'foo-integration-test.js': 'integration test',
  //       },
  //     },
  //   });

  //   fixturifyProject.writeSync(FILE_PATH);

  //   let project = fixturifyProject.buildProjectModel();
  //   const taskResults = await new TestsTask(project, []).run();
  //   const testsTaskResult = <TestsTaskResult>taskResults.pop();

  //   assert.equal(Object.keys(testsTaskResult.tests).length, 3);
  //   assert.equal(testsTaskResult.tests.unit.length, 3);
  //   assert.equal(testsTaskResult.tests.acceptance.length, 2);
  //   assert.equal(testsTaskResult.tests.integration.length, 1);
  // });
});
