export default class MockConsole {
  _buffer: string[];
  log: (message: string) => void;

  constructor() {
    this._buffer = [];
    this.log = message => {
      this._buffer.push(message);
    };
  }

  toString() {
    return this._buffer.join('\n');
  }
}
