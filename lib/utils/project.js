const fs = require('fs');
const path = require('path');

const TYPE = {
  APP: 'application',
  ADDON: 'addon',
  ENGINE: 'engine',
  UNKNOWN: 'unknown',
};

function getProjectType(project) {
  let pkg = project.pkg;

  if (
    pkg.keywords &&
    Array.isArray(pkg.keywords) &&
    pkg.keywords.indexOf('ember-addon') >= 0
  ) {
    if (fs.existsSync(path.join(project.root, 'addon', 'engine.js'))) {
      return TYPE.ENGINE;
    } else {
      return TYPE.ADDON;
    }
  } else if (
    (pkg.dependencies && Object.keys(pkg.dependencies).includes('ember-cli')) ||
    (pkg.devDependencies &&
      Object.keys(pkg.devDependencies).includes('ember-cli'))
  ) {
    return TYPE.APP;
  }

  return TYPE.UNKNOWN;
}

module.exports = {
  getProjectType,
};
