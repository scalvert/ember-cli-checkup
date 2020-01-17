// @ts-ignore
import IFixturifyProject = require('ember-cli/tests/helpers/fixturify-project');
const DisposableFixturifyProject = require('../../helpers/DisposableFixturifyProject');
const MockUI = require('console-ui/mock');

import {
  IProject,
  ITaskResult,
  IConsoleWriter,
  ITask,
  ITaskConstructor,
} from '../../../interfaces';
import Checkup from '../../../checkup';
import ResultWriter from '../../../utils/result-writer';
import MockConsole from '../utils/mock-console';
import ConsoleWriter from '../../../utils/console-writer';
import Task from '../../..//task';

const { test } = QUnit;

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

const TESTS = {
  unit: {
    utils: {
      'foo-test.js': `
        import { module, test } from 'qunit';

        module('Unit | Utils | foo', function() {
          test('bar', function(assert) {
            assert.ok(true);
          });

          skip('biz', function(assert) {
            assert.ok(true);
          });

          test('barbiz', function(assert) {
            assert.ok(true);
          });
        });
      `,
    },
  },
};

class FakeTaskResult implements ITaskResult {
  name!: string;
  version!: string;

  toConsole(writer: IConsoleWriter) {
    writer.text(`name: ${this.name}, version: ${this.version}`);
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

QUnit.module('result-writer', function(hooks) {
  let fixturifyProject: IFixturifyProject;
  let project: IProject;

  hooks.beforeEach(function() {
    fixturifyProject = new DisposableFixturifyProject('cli-checkup-app', '0.0.0');
    fixturifyProject.addDevDependency('ember-cli-string-utils', 'latest');
    fixturifyProject.addDevDependency('ember-source', 'latest');
    fixturifyProject.addDevDependency('ember-cli', 'latest');
    fixturifyProject.addDevDependency('ember-data', 'latest');
    fixturifyProject.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    project = fixturifyProject.buildProjectModel();
  });

  hooks.afterEach(function() {
    fixturifyProject.dispose(FILE_PATH);
  });

  test('result writer outputs json output correctly for the default tasks', async function(assert) {
    fixturifyProject.files = Object.assign(fixturifyProject.files, {
      'index.js': 'index js file',
      addon: TYPES,
      tests: TESTS,
    });

    project = fixturifyProject.buildProjectModel();
    let checkup = new Checkup({ silent: true }, project, new MockUI());
    let result: ITaskResult[] = await checkup.run();
    let writer = new ResultWriter(result);

    const expectedJsonResult = {
      name: 'cli-checkup-app',
      type: 'application',
      version: '0.0.0',
      dependencies: {
        emberLibraries: {
          'ember-source': 'latest',
          'ember-cli': 'latest',
          'ember-data': 'latest',
        },
        emberAddons: {
          dependencies: {},
          devDependencies: {
            'ember-source': 'latest',
            'ember-data': 'latest',
          },
        },
        emberCliAddons: {
          dependencies: {
            'ember-cli-blueprint-test-helpers': 'latest',
          },
          devDependencies: {
            'ember-cli-string-utils': 'latest',
            'ember-cli': 'latest',
          },
        },
      },
      types: {
        components: ['addon/components/my-component.js'],
        controllers: ['addon/controllers/my-controller.js'],
        helpers: ['addon/helpers/my-helper.js'],
        initializers: ['addon/initializers/my-initializer.js'],
        'instance-initializers': ['addon/instance-initializers/my-helper.js'],
        mixins: ['addon/mixins/my-mixin.js'],
        models: ['addon/models/my-model.js'],
        routes: ['addon/routes/my-route.js'],
        services: ['addon/services/my-service.js'],
        templates: ['addon/templates/my-component.hbs'],
      },
      tests: {
        application: {
          moduleCount: 0,
          skipCount: 0,
          testCount: 0,
        },
        container: {
          moduleCount: 0,
          skipCount: 0,
          testCount: 0,
        },
        rendering: {
          moduleCount: 0,
          skipCount: 0,
          testCount: 0,
        },
        unit: {
          moduleCount: 1,
          skipCount: 1,
          testCount: 2,
        },
      },
    };

    assert.deepEqual(
      writer.toJson(),
      expectedJsonResult,
      'toJson for all the tasks works correctly'
    );
  });

  test('result writer outputs console output correctly for all tasks', async function(assert) {
    let tasks: ITaskConstructor[] = [FakeTask];
    let checkup = new Checkup({ silent: true }, project, new MockUI(), tasks);

    // Console specific setup
    let mockConsole = new MockConsole();
    let consoleWriter = new ConsoleWriter(mockConsole.log);

    let result: ITaskResult[] = await checkup.run();
    let writer = new ResultWriter(result, consoleWriter);

    writer.toConsole();
    assert.equal(
      mockConsole.toString(),
      ` \nname: Foobar, version: latest`,
      'toConsole works correctly'
    );
  });
});
