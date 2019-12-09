// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
// @ts-ignore
import Project = require('ember-cli/lib/models/project');
import { TypesTask } from '../../tasks';
import { TypesTaskResult } from '../../results';
const DisposableFixturifyProject = require('../helpers/DisposableFixturifyProject');

var module = QUnit.module;
const test = QUnit.test;

const FILE_PATH = 'tests/testApp';

const TYPES = {
  components: {
    'my-component.js': '',
  },
  controllers: {
    'my-controller.js': '',
  },
  helpers: {
    'my-helper.js': '',
  },
  initializers: {
    'my-initializer.js': '',
  },
  'instance-initializers': {
    'my-helper.js': '',
  },
  mixins: {
    'my-mixin.js': '',
  },
  models: {
    'my-model.js': '',
  },
  routes: {
    'my-route.js': '',
  },
  services: {
    'my-service.js': '',
  },
  templates: {
    'my-component.hbs': '',
  },
};

module('types-task', function(hooks) {
  let fixturifyProject: IFixturifyProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('it returns all the types found in the app', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel();
    const taskResults = await new TypesTask(project, []).run();
    const typesTaskResult = <TypesTaskResult>taskResults.pop();

    assert.equal(Object.keys(typesTaskResult.types).length, 10);
    assert.equal(typesTaskResult.types.components.length, 1);
    assert.equal(typesTaskResult.types.controllers.length, 1);
    assert.equal(typesTaskResult.types.helpers.length, 1);
    assert.equal(typesTaskResult.types.initializers.length, 1);
    assert.equal(typesTaskResult.types['instance-initializers'].length, 1);
    assert.equal(typesTaskResult.types.mixins.length, 1);
    assert.equal(typesTaskResult.types.models.length, 1);
    assert.equal(typesTaskResult.types.routes.length, 1);
    assert.equal(typesTaskResult.types.services.length, 1);
    assert.equal(typesTaskResult.types.templates.length, 1);
  });

  test('it returns all the types found in the app', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.addInRepoAddon('ember-super-button', 'latest');

    // @ts-ignore
    fixturifyProject.files.lib['ember-super-button'].addon = TYPES;
    // @ts-ignore

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel(Project);
    const taskResults = await new TypesTask(project, []).run();
    const typesTaskResult = <TypesTaskResult>taskResults.pop();

    assert.equal(Object.keys(typesTaskResult.types).length, 10);
    assert.equal(typesTaskResult.types.components.length, 2);
    assert.equal(typesTaskResult.types.controllers.length, 2);
    assert.equal(typesTaskResult.types.helpers.length, 2);
    assert.equal(typesTaskResult.types.initializers.length, 2);
    assert.equal(typesTaskResult.types['instance-initializers'].length, 2);
    assert.equal(typesTaskResult.types.mixins.length, 2);
    assert.equal(typesTaskResult.types.models.length, 2);
    assert.equal(typesTaskResult.types.routes.length, 2);
    assert.equal(typesTaskResult.types.services.length, 2);
    assert.equal(typesTaskResult.types.templates.length, 2);
  });
});
