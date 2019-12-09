import { Node, NodePath } from '@babel/traverse';
import { ITask, IProject, ITaskResult, ITestMetrics } from '../interfaces';
import Task from '../task';
import AstSearcher from '../utils/ast-searcher';
import { ISearchTraverser } from '../interfaces';
import JavaScriptTraverser from '../utils/javascript-traverser';

interface ITestTraverserFileResult {
  type: TestType;
  invocationMap: Map<string, Node[]>;
}

enum TestType {
  Application = 'application',
  Container = 'container',
  Rendering = 'rendering',
  Unit = 'unit',
}

const TEST_TYPE_MAP = {
  setupApplicationTest: TestType.Application,
  setupRenderingTest: TestType.Rendering,
  setupTest: TestType.Container,
};

// const testIdentifiers = ['setupApplicationTest', 'setupRenderingTest', 'setupTest'];

const INVOCATIONS = ['test', 'module', 'skip'];

class TestTraverser extends JavaScriptTraverser
  implements ISearchTraverser<ITestTraverserFileResult> {
  _results: Map<string, Node[]>;
  _testType: TestType;

  constructor() {
    super();

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

  /**
   * Returns the Node count of the individual test metrics from the ast search result.
   * Possible Metrics - moduleCount, skipCount, testCount
   * @param invocationMap
   * @param metricType
   */
  getTestMetricCount(invocationMap: Map<string, Node[]>, metricType: string) {
    const metricValue = invocationMap.get(metricType);
    return metricValue ? metricValue.length : 0;
  }

  /**
   * Returns the result from the AST searcher into the TestsTaskResult format
   * @param testResults
   */
  getTransformedResult(
    testResults: Map<string, { type: string; invocationMap: Map<string, Node[]> }>
  ) {
    const result = {
      data: {},
    };
    const resultData: { [key: string]: ITestMetrics } = result.data;

    for (const [, value] of testResults.entries()) {
      resultData[value.type.toLowerCase()] = {
        moduleCount: this.getTestMetricCount(value.invocationMap, 'module'),
        skipCount: this.getTestMetricCount(value.invocationMap, 'skip'),
        testCount: this.getTestMetricCount(value.invocationMap, 'test'),
      };
    }

    return result;
  }

  async run() {
    let astSearcher: AstSearcher = new AstSearcher(this.project.root, ['**/tests/**/*.js']);

    const testVisitor = new TestTraverser();
    const testResults = await astSearcher.search(testVisitor);

    // Transform the result into TestsTaskResult format
    return this.getTransformedResult(testResults);
  }
}
