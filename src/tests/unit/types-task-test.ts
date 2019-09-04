// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
// @ts-ignore
import Project = require('ember-cli/lib/models/project');
import Result from '../../result';
import TypesTask from '../../tasks/types-task';
const EmberCheckupFixturifyProject = require('../helpers/EmberCheckupFixturifyProject');

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
    fixturifyProject = new EmberCheckupFixturifyProject('cli-checkup-app', '0.0.0');
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
    const resultData = await new TypesTask(project, new Result()).run();

    assert.equal(Object.keys(resultData.types).length, 8);
    assert.equal(resultData.types.components.length, 1);
    assert.equal(resultData.types.controllers.length, 1);
    assert.equal(resultData.types.helpers.length, 1);
    assert.equal(resultData.types.mixins.length, 1);
    assert.equal(resultData.types.models.length, 1);
    assert.equal(resultData.types.routes.length, 1);
    assert.equal(resultData.types.services.length, 1);
    assert.equal(resultData.types.templates.length, 1);
  });

  test('it returns all the types found in the app', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
    });

    fixturifyProject.addInRepoAddon('ember-super-button', 'latest');

    fixturifyProject.files.lib['ember-super-button'].addon = TYPES;

    fixturifyProject.writeSync(FILE_PATH);

    let project = fixturifyProject.buildProjectModel(Project);
    const resultData = await new TypesTask(project, new Result()).run();

    assert.equal(Object.keys(resultData.types).length, 8);
    assert.equal(resultData.types.components.length, 2);
    assert.equal(resultData.types.controllers.length, 2);
    assert.equal(resultData.types.helpers.length, 2);
    assert.equal(resultData.types.mixins.length, 2);
    assert.equal(resultData.types.models.length, 2);
    assert.equal(resultData.types.routes.length, 2);
    assert.equal(resultData.types.services.length, 2);
    assert.equal(resultData.types.templates.length, 2);
  });
});
