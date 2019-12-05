class AstCache {
  cache: Map<string, any>;

  constructor() {
    this.cache = new Map<string, any>();
  }

  get(filePath: string) {
    return this.cache.get(filePath);
  }

  set(filePath: string, ast: any) {
    this.cache.set(filePath, ast);
  }

  has(filePath: string) {
    return this.cache.has(filePath);
  }
}

export default new AstCache();
