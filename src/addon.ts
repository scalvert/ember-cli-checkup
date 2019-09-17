import Checkup from './checkup';
import { ICommand, IOptions, ITaskResult } from './interfaces';

let command: ICommand = {
  name: 'checkup',
  aliases: ['cu'],
  description: 'A checkup for your Ember application or addon',
  works: 'insideProject',
  availableOptions: [
    { name: 'verbose', type: Boolean, default: false, aliases: ['v'] },
    { name: 'silent', type: Boolean, default: false, aliases: ['s'] },
  ],

  run(options: IOptions): Promise<ITaskResult[]> {
    let checkup = new Checkup(options, this.project, this.ui);

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
