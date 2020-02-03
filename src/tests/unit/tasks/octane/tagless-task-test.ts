import TaglessTask from '../../../../tasks/octane/tagless-task';
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const DisposableFixturifyProject = require('../../../helpers/DisposableFixturifyProject');

const { test } = QUnit;

const FILE_PATH = 'test-app';

QUnit.module('Octane | Tagless Task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it should default to fully converted if nothing is found', async function(assert) {
    fixturifyProject.writeSync(FILE_PATH);

    const project = fixturifyProject.buildProjectModel();
    const result = await new TaglessTask(project).run();

    const { percentage } = result.toJson();

    assert.equal(percentage, 100, 'percentage is 100%');
  });

  test('it should identify a component with a "tagName" defined', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'card.js': `
            import Component from '@ember/component';

            export default Component.extend({});
          `,
          'card-1.js': `
            import Component from '@ember/component';

            export default Component.extend({
              tagName: 'article',
            });
          `,
          'card-2.js': `
            import Component from '@ember/component';

            export default Component.extend();
          `,
        },
      },
    });

    fixturifyProject.writeSync(FILE_PATH);

    const project = fixturifyProject.buildProjectModel();
    const result = await new TaglessTask(project).run();

    const { percentage } = result.toJson();

    assert.equal(percentage, 0, 'percentage is 0%');
  });

  test('it should find a tagless component', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      app: {
        components: {
          'card.js': `
            import Component from '@ember/component';

            export default Component.extend({
              tagName: '',
              title: 'Some Title',
            });
          `,
        },
        templates: {
          'card.hbs': `
            <article>
              <header>{{title}}</header>
            </article>
          `,
        },
      },
    });

    const project = fixturifyProject.buildProjectModel();
    const result = await new TaglessTask(project).run();

    const { percentage } = result.toJson();

    assert.equal(percentage, 100, 'percentage is 100%');
  });

  // test('it should find a mix of converted components', async function(assert) {});

  // test('it should work with component defined in internal addons/engined', async function(assert) {});
});
