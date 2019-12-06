const { test } = QUnit;
const EmberCheckupFixturifyProject = require('../../helpers/EmberCheckupFixturifyProject');
import AstSearcher from '../../../utils/ast-searcher';

// const getCircularReplacer = () => {
//   const seen = new WeakSet();
//   return (key, value) => {
//     if (typeof value === 'object' && value !== null) {
//       if (seen.has(value)) {
//         return;
//       }
//       seen.add(value);
//     }
//     return value;
//   };
// };

QUnit.module('Utils | ast-searcher', function(hooks) {
  const FILE_PATH = 'test-app';

  let fixturifyProject;
  let searcher;

  hooks.beforeEach(function() {
    fixturifyProject = new EmberCheckupFixturifyProject('cli-checkup-app', '0.0.0');
    searcher = new AstSearcher(FILE_PATH);
  });

  hooks.afterEach(function() {
    // fixturifyProject.dispose(FILE_PATH);
  });

  test('foo', async function(assert) {
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

    class MyVisitor {
      constructor() {
        this._results = [];
      }

      clearResults() {
        this._results = [];
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
    // assert.equal(myVisitor.totalCount, 5, 'total count is correct');
  });
});
