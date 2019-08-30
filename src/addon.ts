import Checkup from './checkup';
import { ICommand, ICheckupResult } from './interfaces';

let command: ICommand = {
  name: 'checkup',
  description: 'A checkup for your Ember application or addon',
  works: 'insideProject',

  run(): Promise<ICheckupResult> {
    let checkup = new Checkup(this.project, this.ui);

    return checkup.run();
  },
};

export default {
  name: 'ember-cli-checkup',

  includedCommands: function() {
    return {
      checkup: command,
    };
  },
};
