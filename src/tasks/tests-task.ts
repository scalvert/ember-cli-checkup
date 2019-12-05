import { ITask, IProject, ITaskResult } from '../interfaces';
import Task from '../task';
import AstSearcher from '../utils/ast-searcher';
import { ISearchTraverser } from '../interfaces';
import { Node, NodePath } from '@babel/traverse';

interface ITestTraverserFileResult {
  type: TestType;
  invocationMap: Map<string, Node[]>;
}

enum TestType {
  Application = 'Application',
  Container = 'Container',
  Rendering = 'Rendering',
  Unit = 'Unit',
}

const TEST_TYPE_MAP = {
  setupApplicationTest: TestType.Application,
  setupRenderingTest: TestType.Rendering,
  setupTest: TestType.Container,
};

// const testIdentifiers = ['setupApplicationTest', 'setupRenderingTest', 'setupTest'];

const INVOCATIONS = ['test', 'module', 'skip'];

class TestTraverser implements ISearchTraverser<ITestTraverserFileResult> {
  _results: Map<string, Node[]>;
  _testType: TestType;

  constructor() {
    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get hasResults() {
    return !!this._results.size;
  }

  reset() {
    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get results() {
    return {
      type: this._testType,
      invocationMap: this._results,
    };
  }

  get visitors() {
    return {
      Identifier: (path: NodePath) => {
        const pathNodeName: string = path.node.type === 'Identifier' ? path.node.name : '';

        // Identify Type
        if (
          (pathNodeName === 'setupApplicationTest' ||
            pathNodeName === 'setupRenderingTest' ||
            pathNodeName === 'setupTest') &&
          path.parent.type === 'CallExpression'
        ) {
          this._testType = TEST_TYPE_MAP[pathNodeName];
        }

        // Measure metrics
        if (INVOCATIONS.includes(pathNodeName) && path.parent.type === 'CallExpression') {
          let nodes = this._results.get(pathNodeName) || [];

          if (nodes.length === 0) {
            this._results.set(pathNodeName, nodes);
          }

          nodes.push(path.node);
        }
      },
    };
  }
}

export default class TestsTask extends Task implements ITask {
  constructor(project: IProject, result: ITaskResult[]) {
    super(project, result);
  }

  async run() {
    let astSearcher: AstSearcher = new AstSearcher(this.project.root, ['**/tests/**/*.js']);

    const testVisitor = new TestTraverser();
    const testResults = await astSearcher.search(testVisitor);

    // TODO: Need to finish this transform into the proper return type
    return testResults;
  }
}
