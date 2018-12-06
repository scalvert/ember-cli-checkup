class Task {
  constructor(title, context, ui) {
    this.title = title;
    this.context = context;
    this.ui = ui;
  }

  run() {
    this.ui.spinner.title = this.title;
  }
}

module.exports = Task;
