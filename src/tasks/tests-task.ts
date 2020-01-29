import { Node, NodePath } from '@babel/traverse';
import { ITask, ISearchTraverser, TestType } from '../interfaces';
import Task from '../task';
import AstSearcher from '../searchers/ast-searcher';
import JavaScriptTraverser from '../traversers/javascript-traverser';
import { TestsTaskResult } from '../results';

export type TestTraverserFileResult = {
  type: TestType;
  invocationMap: Map<string, Node[]>;
};

const TEST_TYPE_MAP = {
  setupApplicationTest: TestType.Application,
  setupRenderingTest: TestType.Rendering,
  setupTest: TestType.Container,
};

const INVOCATIONS = ['test', 'module', 'skip'];

class TestTraverser extends JavaScriptTraverser
  implements ISearchTraverser<TestTraverserFileResult> {
  _results: Map<string, Node[]>;
  _testType: TestType;

  constructor() {
    super();

    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get hasResults(): boolean {
    return !!this._results.size;
  }

  reset() {
    this._results = new Map<string, Node[]>();
    this._testType = TestType.Unit;
  }

  get results(): TestTraverserFileResult {
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
  async run(): Promise<TestsTaskResult> {
    let astSearcher = new AstSearcher(this.project.root, ['**/tests/**/*.js']);

    const testVisitor = new TestTraverser();
    const testResults = await astSearcher.search(testVisitor);

    const result = new TestsTaskResult();
    result.transformAndLoadResults(testResults);

    return result;
  }
}
