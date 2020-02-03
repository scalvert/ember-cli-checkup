import Task from '../../task';
import { ITaskResult, IConsoleWriter, ISearchTraverser } from '../../types';
import { Node, NodePath } from '@babel/traverse';
import AstSearcher from '../../searchers/ast-searcher';
import JavaScriptTraverser from '../../traversers/javascript-traverser';

type TaglessMigrationFileResult = {
  componentDefs: Node[];
};

class TaglessTaskResult implements ITaskResult {
  _verbose: {
    migrated: Node[];
    remaining: Node[];
  } = {
    migrated: [],
    remaining: [],
  };

  get basic() {
    const migratedCount = this.verbose.migrated.length;
    const total = migratedCount + this.verbose.remaining.length;

    if (!total) {
      return {
        percentage: 100,
      };
    }

    return {
      percentage: migratedCount / total,
    };
  }

  get verbose() {
    return this._verbose;
  }

  toConsole(writer: IConsoleWriter) {
    writer.heading('Implement Me!');
    writer.line();
  }

  toJson() {
    return this.basic;
  }

  transformAndLoadResults(results: Map<string, TaglessMigrationFileResult>) {
    for (const [, { componentDefs }] of results.entries()) {
      this._verbose.remaining.push(...componentDefs);
    }
  }
}

class TaglessComponentTraverser extends JavaScriptTraverser
  implements ISearchTraverser<TaglessMigrationFileResult> {
  // constructor() {
  //   super();
  // }

  get hasResults(): boolean {
    return false;
  }

  get results(): TaglessMigrationFileResult {
    return {
      componentDefs: [],
    };
  }

  get visitors() {
    return {
      Identifier: (path: NodePath) => {
        const pathNodeName: string = path.node.type === 'Identifier' ? path.node.name : '';

        console.log(pathNodeName);
      },
    };
  }

  reset() {}
}

export default class TaglessTask extends Task {
  async run() {
    const astSearcher = new AstSearcher(this.project.root, ['**/components/**/*.js']);

    const taglessTraverser = new TaglessComponentTraverser();
    const searchResults = await astSearcher.search(taglessTraverser);
    const result = new TaglessTaskResult();

    result.transformAndLoadResults(searchResults);

    return result;
  }
}
