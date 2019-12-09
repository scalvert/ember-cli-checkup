const { test } = QUnit;
const DisposableFixturifyProject = require('../../helpers/DisposableFixturifyProject');
import AstSearcher from '../../../searchers/ast-searcher';
import { handlebarsAstCache } from '../../../utils/ast-cache';
import HandlebarsTraverser from '../../../traversers/handlebars-traverser';

class CustomHandlebarsTraverser extends HandlebarsTraverser {
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
      PathExpression: node => {
        if (node.original === 'foo') {
          this._nodes.push(node);
        }
      },
    };
  }
}

QUnit.module('ast-searcher using HandlebarsTraverser', function(hooks) {
  const FILE_PATH = 'test-app';

  let fixturifyProject;
  let searcher;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
    searcher = new AstSearcher(FILE_PATH, ['**/*.hbs']);
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
    handlebarsAstCache.clear();
  });

  test('it finds no results for empty content', async function(assert) {
    const results = await searcher.search(new CustomHandlebarsTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds no results when traverser pattern not found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'foo-bar.hbs': `
            {{bar}}
          `,
          'foo-baz.hbs': `
            {{baz}}
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomHandlebarsTraverser());

    assert.equal(results.size, 0);
  });

  test('it finds files/nodes when traverser pattern found', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'foo-bar.hbs': `
            <div>
              {{foo}}
            </div>
          `,
        },
        services: {
          'foo-baz.hbs': `
            {{#if condition}}
              {{foo}}
            {{/if}}
          `,
          'foo-blarg.hbs': `
            {{#if nothingHere}}
              Do nothing
            {{/if}}
          `,
        },
        helpers: {
          'foo-bar.hbs': `
            {{#my-component}}
              {{foo}}
              {{bar}}
              {{baz}}
            {{/my-component}}
          `,
        },
        controllers: {
          'foo-fum.hbs': `
            {{fum}}
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const results = await searcher.search(new CustomHandlebarsTraverser());

    let nodeCount = 0;
    results.forEach(value => (nodeCount += value.length));

    assert.equal(results.size, 3);
    assert.equal(nodeCount, 3);
  });
});
