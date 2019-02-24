const pMap = require('p-map');

class TaskList {
  constructor(context, ui) {
    this.context = context;
    this.ui = ui;
    this.tasks = [];
    this.defaultTasks = [];
  }

  addDefault(ctor) {
    this.defaultTasks.push(new ctor(this.context, this.ui));
  }

  add(ctor) {
    this.tasks.push(new ctor(this.context, this.ui));
  }

  run() {
    return this._eachTask(task => {
      return task.run();
    });
  }

  write() {
    return this._eachTask(task => {
      return task.writeToOutput();
    });
  }

  _eachTask(fn) {
    return pMap([...this.defaultTasks, ...this.tasks], fn).then(
      () => this.context
    );
  }
}

module.exports = TaskList;
