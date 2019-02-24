'use strict';

const Checkup = require('./lib/checkup');

module.exports = {
  name: require('./package').name,
  includedCommands: function() {
    return {
      checkup: {
        name: 'checkup',
        description: 'A checkup for your Ember application or addon',
        works: 'insideProject',

        run(options, rawArgs) {
          let project = Object.assign(
            Object.create(Object.getPrototypeOf(this.project)),
            this.project
          );

          let checkup = new Checkup(options, rawArgs, project, this.ui);

          return checkup.run();
        },
      },
    };
  },
};
