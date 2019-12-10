const { test } = QUnit;
const DisposableFixturifyProject = require('../../helpers/DisposableFixturifyProject');
import AstSearcher from '../../../searchers/ast-searcher';
import { javascriptAstCache } from '../../../utils/ast-cache';
import JavaScriptTraverser from '../../../traversers/javascript-traverser';

class CustomJavaScriptTraverser extends JavaScriptTraverser {
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
        if (path.node.name === 'foo' && path.parent.type !== 'ImportDefaultSpecifier') {
          this._nodes.push(path.node);
        }
      },
    };
  }
}

QUnit.module('ast-searcher using JavaScriptTraverser', function(hooks) {
  const FILE_PATH = 'test-app';

  let fixturifyProject;
  let searcher;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
    searcher = new AstSearcher(FILE_PATH);
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
    javascriptAstCache.clear();
  });

  test('it finds no results for empty content', async function(assert) {
    const results = await searcher.search(new CustomJavaScriptTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds no results when traverser pattern not found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'foo-bar.js': `
            import Component from '@ember/component';

            export default Component.extend({
              init() {
                bar();
              }
            });
          `,
          'foo-baz.js': `
            import Component from '@ember/component';

            export default Component.extend({
              init() {
                bar();
              }
            });
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomJavaScriptTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds files/nodes when traverser pattern found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'foo-bar.js': `
            import Component from '@ember/component';
            import foo from 'foo';

            export default Component.extend({
              init() {
                foo();
              }
            });
          `,
        },
        services: {
          'foo-baz.js': `
            import Component from '@ember/component';
            import foo from 'foo';

            export default Component.extend({
              init() {
                foo();
              },

              baz() {
                if (thing()) {
                  foo();
                }
              }
            });
          `,
          'foo-blarg.js': `
            import Component from '@ember/component';

            export default Component.extend({
              init() {
                blarg();
              }
            });
          `,
        },
        helpers: {
          'foo-bar.js': `
            import Component from '@ember/component';
            import foo from 'foo';

            export default Component.extend({
              init() {
                let f = foo();
                let b = bar();
              }
            });
          `,
        },
        controllers: {
          'foo-fum.js': `
            import Component from '@ember/component';

            export default Component.extend({
              init() {
                fum();
              }
            });
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomJavaScriptTraverser());

    let nodeCount = 0;
    results.forEach(value => (nodeCount += value.length));

    assert.equal(results.size, 3);
    assert.equal(nodeCount, 4);
  });
});
