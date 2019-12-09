const { test } = QUnit;
const DisposableFixturifyProject = require('../../helpers/DisposableFixturifyProject');
import AstSearcher from '../../../searchers/ast-searcher';
import JavaScriptTraverser from '../../../traversers/javascript-traverser';

class CustomTraverser extends JavaScriptTraverser {
  constructor() {
    super();

    this._nodes = [];
  }

  reset() {
    this._nodes = [];
  }

  get hasResults() {
    return !!this._nodes.length;
  }

  get results() {
    return this._nodes;
  }

  get visitors() {
    return {
      Identifier: path => {
        if (path.node.name === 'PDSCMockerShim' && path.parent.type !== 'ImportDefaultSpecifier') {
          this._nodes.push(path.node);
        }
      },
    };
  }
}

// TODO: convert to TS
QUnit.module('ast-searcher', function(hooks) {
  const FILE_PATH = 'test-app';

  let fixturifyProject;
  let searcher;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
    searcher = new AstSearcher(FILE_PATH);
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it finds no results for empty content', async function(assert) {
    const results = await searcher.search(new CustomTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds no results when traverser pattern not found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
        unit: {
          'foo-unit-test.js': `
            import { module } from 'qunit';

            module('Unit | foo/bar', function(hooks) {
              hooks.before(function() {
                this.contactsMocks = foo();
              });
            });
          `,
          'bar-unit-test.js': `
            import { module } from 'qunit';

            module('Unit | foo/bar', function(hooks) {
              hooks.before(function() {
                this.contactsMocks = {};
              });
            });
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds files/nodes when traverser pattern found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      tests: {
        helpers: {
          'uses-pdsc-mocker-shim.js': `
            import PDSCMockerShim from 'ember-restli-mocker-shims/test-support/pdsc-mocker-shim';

            export default function createMeMock() {
              return PDSCMockerShim.create('common/me').with({ foo: 'bar' });
            }
          `,
        },
        unit: {
          'foo-unit-test.js': `
            import { module } from 'qunit';
            import PDSCMockerShim from 'ember-restli-mocker-shims/test-support/pdsc-mocker-shim';

            module('Unit | foo/bar', function(hooks) {
              hooks.before(function() {
                this.contactsMocks = PDSCMockerShim.create(
                  'foo/bar/baz'
                );
                this.contactsMocksNoResults = PDSCMockerShim.create(
                  'bar/baz/biz'
                );
              });
            });
          `,
          'bar-unit-test.js': `
            import { module } from 'qunit';

            module('Unit | foo/bar', function(hooks) {
              hooks.before(function() {
                this.contactsMocks = {};
              });
            });
          `,
        },
        acceptance: {
          'foo-acceptance-test.js': `
            import { module } from 'qunit';
            import PDSCMockerShim from 'ember-restli-mocker-shims/test-support/pdsc-mocker-shim';

            module('Acceptance | foo/bar', function(hooks) {
              hooks.before(function() {
                const barBaz = PDSCMockerShim.create(
                  'bar/baz'
                );
                const bazBiz = PDSCMockerShim.create(
                  'baz/biz'
                );
              });
            });
          `,
        },
        integration: {
          'foo-integration-test.js': `
            import { module } from 'qunit';
            import { setupRenderingTest } from 'ember-qunit';

            module('Integration | Component | foo', function(hooks) {
              setupRenderingTest(hooks);

              hooks.beforeEach(function() {
                this.mock = {};
              });
            });
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomTraverser());

    let nodeCount = 0;
    results.forEach(value => (nodeCount += value.length));

    assert.equal(results.size, 2);
    assert.equal(nodeCount, 3);
  });
});
