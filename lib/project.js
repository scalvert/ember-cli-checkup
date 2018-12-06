/* eslint-env node */

const fs = require('fs');
const path = require('path');

const TYPE = {
  APP: 'application',
  ADDON: 'addon',
  ENGINE: 'engine',
};

module.exports = class Project {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.packageJson = require(path.resolve(
      path.join(this.baseDir, 'package.json')
    ));
    this.name = this.packageJson.name;
    this.version = this.packageJson.version;
  }

  getDependencyVersion(dependencyName, isDevDependency = false) {
    let deps = this.packageJson[
      isDevDependency ? 'devDependencies' : 'dependencies'
    ];

    return dependencyName in deps ? deps[dependencyName] : false;
  }

  get type() {
    if (!this._type) {
      if (
        this.packageJson.keywords &&
        Array.isArray(this.packageJson.keywords) &&
        this.packageJson.keywords.indexOf('ember-addon') >= 0
      ) {
        if (fs.existsSync(path.join(this.baseDir, 'addon', 'engine.js'))) {
          this._type = TYPE.ENGINE;
        } else {
          this._type = TYPE.ADDON;
        }
      } else if (
        (this.packageJson.dependencies &&
          Object.keys(this.packageJson.dependencies).includes('ember-cli')) ||
        (this.packageJson.devDependencies &&
          Object.keys(this.packageJson.devDependencies).includes('ember-cli'))
      ) {
        this._type = TYPE.APP;
      }
    }

    return this._type;
  }
};
