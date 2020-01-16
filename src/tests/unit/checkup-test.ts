// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const FixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const MockUI = require('console-ui/mock');
const globby = require('globby');

import { ITaskConstructor, ITask, IProject, ITaskResult, IConsoleWriter } from '../../interfaces';
import Checkup from '../../checkup';
import Task from '../../task';

const { test } = QUnit;

class FakeTaskResult implements ITaskResult {
  name!: string;
  version!: string;

  toConsole(writer: IConsoleWriter) {
    writer.line();
  }

  toJson() {
    return { name: this.name, version: this.version };
  }
}

class FakeTask extends Task implements ITask {
  constructor(project: IProject) {
    super(project);
  }

  async run(): Promise<ITaskResult> {
    let result = new FakeTaskResult();
    result.name = 'Foobar';
    result.version = 'latest';

    return result;
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
    let checkup = new Checkup({ silent: true }, project, new MockUI());
    let expectedTaskFiles = globby.sync(process.cwd() + '/src/tasks/*-task.ts');

    assert.equal(checkup.defaultTasks.length, expectedTaskFiles.length);
  });

  test('checkup run correctly runs all tasks', async function(assert) {
    let tasks: ITaskConstructor[] = [FakeTask];
    let checkup = new Checkup({ silent: true }, project, new MockUI(), tasks);

    let result: ITaskResult[] = await checkup.run();
    let taskResult = <FakeTaskResult>result.pop();

    assert.equal(taskResult.name, 'Foobar');
    assert.equal(taskResult.version, 'latest');
  });
});
