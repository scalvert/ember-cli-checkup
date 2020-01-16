import { ITaskResult, IConsoleWriter, IDependencyList, IDictionary } from '../interfaces';

export default class DependenciesTaskResult implements ITaskResult {
  emberLibraries!: IDictionary<string>;
  emberAddons!: IDependencyList;
  emberCliAddons!: IDependencyList;

  constructor() {
    this.emberLibraries = {};
  }

  toConsole(writer: IConsoleWriter) {
    writer.heading('Dependencies');
    writer.table('Ember Core Libraries', this.emberLibraries);
    writer.line();

    writer.table('Ember Addons', this.emberAddons.dependencies);
    writer.table('Ember CLI Addons', this.emberCliAddons.dependencies);
    writer.line();
  }

  toJson() {
    return {
      dependencies: {
        emberLibraries: this.emberLibraries,
        emberAddons: this.emberAddons,
        emberCliAddons: this.emberCliAddons,
      },
    };
  }
}
