// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
import { TestsTask } from '../../tasks';
const DisposableFixturifyProject = require('../helpers/DisposableFixturifyProject');

var module = QUnit.module;
const test = QUnit.test;

const FILE_PATH = 'test-app';

module('tests-task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it finds unit tests', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
        unit: {
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
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const result = await new TestsTask(project).run();

    const {
      basic: { unit: unitData },
    } = result;

    assert.equal(unitData.moduleCount, 1, 'unit module count is correct');
    assert.equal(unitData.skipCount, 1, 'unit skip count is correct');
    assert.equal(unitData.testCount, 2, 'unit test count is correct');
  });

  test('it finds container tests', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
        unit: {
          controllers: {
            'bar-test.js': `
              import { module, test } from 'qunit';
              import { setupTest } from 'ember-qunit';

              module('Unit | Controller | bar', function(hooks) {
                setupTest(hooks);

                test('biz', function(assert) {
                  assert.ok(true);
                });

                skip('baz', function(assert) {
                  assert.ok(false);
                });
              });
            `,
          },
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const result = await new TestsTask(project).run();

    const {
      basic: { container: containerData },
    } = result;

    assert.equal(containerData.moduleCount, 1, 'container module count is correct');
    assert.equal(containerData.skipCount, 1, 'container skip count is correct');
    assert.equal(containerData.testCount, 1, 'container test count is correct');
  });

  test('it finds rendering tests', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
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
    const result = await new TestsTask(project).run();

    const {
      basic: { rendering: renderingData },
    } = result;

    assert.equal(renderingData.moduleCount, 1, 'rendering module count is correct');
    assert.equal(renderingData.skipCount, 0, 'rendering skip count is correct');
    assert.equal(renderingData.testCount, 1, 'rendering test count is correct');
  });

  test('it finds application tests', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
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
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const result = await new TestsTask(project).run();

    const {
      basic: { application: applicationData },
    } = result;

    assert.equal(applicationData.moduleCount, 1, 'application module count is correct');
    assert.equal(applicationData.skipCount, 0, 'application skip count is correct');
    assert.equal(applicationData.testCount, 1, 'application test count is correct');
  });

  test('it correctly finds tests when all types are defined', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
        unit: {
          services: {
            'baz-test.js': `
              import { module, test } from 'qunit';
              import { setupTest } from 'ember-qunit';

              module('Unit | Service | baz', function(hooks) {
                setupTest(hooks);

                let baz;

                hooks.beforeEach(function() {
                  baz = this.owner.lookup('service:baz');
                });

                test('baz', function(assert) {
                  assert.ok(baz);
                });
              });
            `,
          },
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
    const result = await new TestsTask(project).run();

    const {
      basic: {
        application: applicationData,
        container: containerData,
        rendering: renderingData,
        unit: unitData,
      },
    } = result;

    assert.equal(applicationData.moduleCount, 1, 'application module count is correct');
    assert.equal(applicationData.skipCount, 0, 'application skip count is correct');
    assert.equal(applicationData.testCount, 1, 'application test count is correct');

    assert.equal(containerData.moduleCount, 2, 'container module count is correct');
    assert.equal(containerData.skipCount, 0, 'container skip count is correct');
    assert.equal(containerData.testCount, 3, 'container test count is correct');

    assert.equal(renderingData.moduleCount, 1, 'rendering module count is correct');
    assert.equal(renderingData.skipCount, 0, 'rendering skip count is correct');
    assert.equal(renderingData.testCount, 1, 'rendering test count is correct');

    assert.equal(unitData.moduleCount, 1, 'unit module count is correct');
    assert.equal(unitData.skipCount, 1, 'unit skip count is correct');
    assert.equal(unitData.testCount, 2, 'unit test count is correct');
  });

  module('in-repo addon', function() {
    test('it finds unit tests', async function(assert) {
      fixturifyProject.addInRepoAddon('mobile', '0.0.1', function(addonProject: IFixturifyProject) {
        addonProject.files = Object.assign(addonProject.files, {
          tests: {
            unit: {
              utils: {
                'bar-test.js': `
                  import { module, test, skip } from 'qunit';

                  module('Unit | Utils | bar', function() {
                    skip('biz', function(assert) {
                      assert.ok(false);
                    });

                    test('baz', function(assert) {
                      assert.ok(true);
                    });
                  });
                `,
              },
            },
          },
        });
      });

      fixturifyProject.files = Object.assign(fixturifyProject.files, {
        tests: {
          unit: {
            utils: {
              'foo-test.js': `
                import { module, test } from 'qunit';

                module('Unit | Utils | foo', function() {
                  test('bar', function(assert) {
                    assert.ok(true);
                  });
                });
              `,
            },
          },
        },
      });

      fixturifyProject.writeSync(FILE_PATH);

      let project = fixturifyProject.buildProjectModel();
      const result = await new TestsTask(project).run();

      const {
        basic: { unit: unitData },
      } = result;

      assert.equal(unitData.moduleCount, 2, 'unit module count is correct');
      assert.equal(unitData.skipCount, 1, 'unit skip count is correct');
      assert.equal(unitData.testCount, 2, 'unit test count is correct');

      // @TODO: Make this as a separate test once the test fixtures are in defined in a separate file
      const expectedJsonResult = {
        tests: {
          application: { moduleCount: 0, skipCount: 0, testCount: 0 },
          container: { moduleCount: 0, skipCount: 0, testCount: 0 },
          rendering: { moduleCount: 0, skipCount: 0, testCount: 0 },
          unit: { moduleCount: 2, skipCount: 1, testCount: 2 },
        },
      };

      assert.deepEqual(result.toJson(), expectedJsonResult, 'toJson output is correct');
    });

    test('it finds container tests', async function(assert) {
      fixturifyProject.addInRepoAddon('mobile', '0.0.1', function(addonProject: IFixturifyProject) {
        addonProject.files = Object.assign(addonProject.files, {
          tests: {
            unit: {
              services: {
                'baz-test.js': `
                  import { module, test } from 'qunit';
                  import { setupTest } from 'ember-qunit';

                  module('Unit | Service | baz', function(hooks) {
                    setupTest(hooks);

                    let baz;

                    hooks.beforeEach(function() {
                      baz = this.owner.lookup('service:baz');
                    });

                    test('baz', function(assert) {
                      assert.ok(baz);
                    });
                  });
                `,
              },
            },
          },
        });
      });

      fixturifyProject.files = Object.assign(fixturifyProject.files, {
        tests: {
          unit: {
            controllers: {
              'bar-test.js': `
                import { module, test } from 'qunit';
                import { setupTest } from 'ember-qunit';

                module('Unit | Controller | bar', function(hooks) {
                  setupTest(hooks);

                  let bar;

                  hooks.beforeEach(function() {
                    bar = this.owner.lookup('controller:bar');
                  });

                  test('biz', function(assert) {
                    assert.ok(bar);
                  });

                  skip('baz', function(assert) {
                    assert.ok(false);
                  });
                });
              `,
            },
          },
        },
      });

      fixturifyProject.writeSync(FILE_PATH);

      let project = fixturifyProject.buildProjectModel();
      const result = await new TestsTask(project).run();

      const {
        basic: { container: containerData },
      } = result;

      assert.equal(containerData.moduleCount, 2, 'container module count is correct');
      assert.equal(containerData.skipCount, 1, 'container skip count is correct');
      assert.equal(containerData.testCount, 2, 'container test count is correct');
    });

    test('it finds rendering tests', async function(assert) {
      fixturifyProject.addInRepoAddon('blog', '0.0.1', function(addonProject: IFixturifyProject) {
        addonProject.files = Object.assign(addonProject.files, {
          tests: {
            components: {
              'blog-post-test.js': `
                import { module, test } from 'qunit';
                import { setupRenderingTest } from 'ember-qunit';
                import { render } from '@ember/test-helpers';
                import hbs from 'htmlbars-inline-precompile';

                module('Integration | Component | blog-post', function(hooks) {
                  setupRenderingTest(hooks);

                  test('should render', async function(assert) {
                    assert.expect(1);

                    this.set('id', 1337);

                    await render(hbs\`<BlogPost @postId={{this.id}} />\`);

                    assert.ok(
                      this.element.querySelector('article.blog-post'),
                      'post renders'
                    );
                  });
                });
              `,
            },
          },
        });
      });

      fixturifyProject.files = Object.assign(fixturifyProject.files, {
        tests: {
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
      const result = await new TestsTask(project).run();

      const {
        basic: { rendering: renderingData },
      } = result;

      assert.equal(renderingData.moduleCount, 2, 'rendering module count is correct');
      assert.equal(renderingData.skipCount, 0, 'rendering skip count is correct');
      assert.equal(renderingData.testCount, 2, 'rendering test count is correct');
    });

    test('it finds application tests', async function(assert) {
      fixturifyProject.addInRepoAddon('mobile', '0.0.1', function(addonProject: IFixturifyProject) {
        addonProject.files = Object.assign(addonProject.files, {
          tests: {
            acceptance: {
              'mobile-login-test.js': `
                import { module, test } from 'qunit';
                import { visit, currentURL } from '@ember/test-helpers';
                import { setupApplicationTest } from 'ember-qunit';

                module('Acceptance | mobile-login', function(hooks) {
                  setupApplicationTest(hooks);

                  test('visiting /m/login', async function(assert) {
                    await visit('/m/login');
                    assert.equal(currentURL(), '/m/login');
                  });
                });
              `,
            },
          },
        });
      });

      fixturifyProject.files = Object.assign(fixturifyProject.files, {
        tests: {
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
        },
      });

      fixturifyProject.writeSync(FILE_PATH);

      let project = fixturifyProject.buildProjectModel();
      const result = await new TestsTask(project).run();

      const {
        basic: { application: applicationData },
      } = result;

      assert.equal(applicationData.moduleCount, 2, 'application module count is correct');
      assert.equal(applicationData.skipCount, 0, 'application skip count is correct');
      assert.equal(applicationData.testCount, 2, 'application test count is correct');
    });

    test('it correctly finds tests when all types are defined', async function(assert) {
      fixturifyProject.addInRepoAddon('mobile', '0.0.1', function(addonProject: IFixturifyProject) {
        addonProject.files = Object.assign(addonProject.files, {
          tests: {
            acceptance: {
              'login-test.js': `
                import { module, test, skip } from 'qunit';
                import { visit, currentURL } from '@ember/test-helpers';
                import { setupApplicationTest } from 'ember-qunit';

                module('Acceptance | login', function(hooks) {
                  setupApplicationTest(hooks);

                  test('visiting /login', async function(assert) {
                    await visit('/login');
                    assert.equal(currentURL(), '/login');
                  });

                  skip('tis broken', function(assert) {
                    assert.ok(false);
                  });
                });
              `,
            },
            unit: {
              utils: {
                'bar-test.js': `
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
          },
        });
      });

      fixturifyProject.files = Object.assign(fixturifyProject.files, {
        'index.js': 'index js file',
        tests: {
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
        },
      });

      fixturifyProject.writeSync(FILE_PATH);

      assert.ok(true);

      let project = fixturifyProject.buildProjectModel();
      const result = await new TestsTask(project).run();

      const {
        basic: {
          application: applicationData,
          container: containerData,
          rendering: renderingData,
          unit: unitData,
        },
      } = result;

      assert.equal(applicationData.moduleCount, 2, 'application module count is correct');
      assert.equal(applicationData.skipCount, 1, 'application skip count is correct');
      assert.equal(applicationData.testCount, 2, 'application test count is correct');

      assert.equal(containerData.moduleCount, 1, 'container module count is correct');
      assert.equal(containerData.skipCount, 0, 'container skip count is correct');
      assert.equal(containerData.testCount, 2, 'container test count is correct');

      assert.equal(renderingData.moduleCount, 1, 'rendering module count is correct');
      assert.equal(renderingData.skipCount, 0, 'rendering skip count is correct');
      assert.equal(renderingData.testCount, 1, 'rendering test count is correct');

      assert.equal(unitData.moduleCount, 1, 'unit module count is correct');
      assert.equal(unitData.skipCount, 1, 'unit skip count is correct');
      assert.equal(unitData.testCount, 2, 'unit test count is correct');

      // @TODO: Make this as a separate test once the test fixtures are in defined in a separate file
      const expectedJsonResult = {
        tests: {
          application: { moduleCount: 2, skipCount: 1, testCount: 2 },
          container: { moduleCount: 1, skipCount: 0, testCount: 2 },
          rendering: { moduleCount: 1, skipCount: 0, testCount: 1 },
          unit: { moduleCount: 1, skipCount: 1, testCount: 2 },
        },
      };

      assert.deepEqual(result.toJson(), expectedJsonResult, 'toJson output is correct');
    });
  });
});
