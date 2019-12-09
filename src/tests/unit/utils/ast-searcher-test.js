const { test } = QUnit;
const DisposableFixturifyProject = require('../../helpers/DisposableFixturifyProject');
import AstSearcher from '../../../searchers/ast-searcher';
import JavaScriptTraverser from '../../../traversers/javascript-traverser';

// TODO: convert to TS
QUnit.module('Utils | ast-searcher', function(hooks) {
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

  test('it finds files/nodes in a basic test', async function(assert) {
    /**
     * Setup test files with references to PDSCMockerShim
     */
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

    class MyVisitor extends JavaScriptTraverser {
      constructor() {
        super();

        this._results = [];
      }

      reset() {
        this._results = [];
      }

      get hasResults() {
        return !!this._results.length;
      }

      get results() {
        return this._results;
      }

      get visitors() {
        return {
          Identifier: path => {
            if (
              path.node.name === 'PDSCMockerShim' &&
              path.parent.type !== 'ImportDefaultSpecifier'
            ) {
              this._results.push(path.node);
            }
          },
        };
      }
    }

    const myVisitor = new MyVisitor();

    const results = await searcher.search(myVisitor);

    assert.equal(results.size, 3, 'search found correct number of files');
  });
});
