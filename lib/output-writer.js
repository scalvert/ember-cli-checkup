module.exports = {
  write(context) {
    return new Promise(resolve => {
      this.writeEmptyLine();
      this.writeLine(`Ember ${context.project.type}`, 2);
      this.writeLine(`Name: ${context.project.name}`, 4);
      this.writeLine(`Version: ${context.project.version}`, 4);
      this.writeEmptyLine();

      resolve();
    });
  },

  writeLine(line, pad = 0) {
    line = line.padStart(line.length + pad, ' ');
    console.log(`${line}`);
  },

  writeEmptyLine() {
    console.log('');
  },
};
