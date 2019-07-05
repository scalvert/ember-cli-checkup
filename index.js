'use strict';

const fs = require('fs');

// If transpiled output is present, always default to loading that first.
// Otherwise, register ts-node if necessary and load from source.
if (fs.existsSync(`${__dirname}/js/addon.js`)) {
  // eslint-disable-next-line node/no-missing-require
  module.exports = require('./js/addon').default;
} else {
  // eslint-disable-next-line node/no-deprecated-api
  if (!require.extensions['.ts']) {
    let options = { project: `${__dirname}/lib/tsconfig.json` };

    // If we're operating in the context of another project, which might happen
    // if someone has installed ember-cli-typescript from git, only perform
    // transpilation and skip the default ignore glob (which prevents anything
    // in node_modules from being transpiled)
    if (process.cwd() !== __dirname) {
      options.skipIgnore = true;
      options.transpileOnly = true;
    }

    // eslint-disable-next-line node/no-unpublished-require
    require('ts-node').register(options);
  }

  // eslint-disable-next-line node/no-missing-require
  module.exports = require('./lib/addon').default;
}
