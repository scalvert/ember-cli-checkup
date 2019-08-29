import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const FixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const MockUI = require('console-ui/mock');
const globby = require('globby');

import { ITaskConstructor, ITask, IProject, ICheckupResult } from '../../interfaces';
import Checkup from '../../lib/checkup';
import Task from '../../lib/task';

const { test } = QUnit;

class FakeTask extends Task implements ITask {
  constructor(project: IProject, result: ICheckupResult) {
    super(project, result);
  }

  run() {
    this.result.name = 'Foobar';
    this.result.version = 'latest';
  }
}

QUnit.module('checkup', function(hooks) {
  let fixturifyProject: IFixturifyProject;
  let project: IProject;

  hooks.beforeEach(function() {
    fixturifyProject = new FixturifyProject('test-app', '0.0.0', () => {});
    project = fixturifyProject.buildProjectModel();
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose();
  });

  test('checkup instantiates with correct number of default tasks', function(assert) {
    let checkup = new Checkup(project, new MockUI());
    let expectedTaskFiles = globby.sync(process.cwd() + '/lib/tasks/*-task.ts');

    assert.equal(checkup.defaultTasks.length, expectedTaskFiles.length);
  });

  test('checkup run correctly runs all tasks', async function(assert) {
    let tasks: ITaskConstructor[] = [FakeTask];
    let checkup = new Checkup(project, new MockUI(), tasks);

    let result: ICheckupResult = await checkup.run();

    assert.equal(result.name, 'Foobar');
    assert.equal(result.version, 'latest');
  });
});
