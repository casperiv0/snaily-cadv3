class Logger {
  private now(): string {
    return new Date().toLocaleString();
  }

  log(type: string, message: string): void {
    console.log(`[${type.toUpperCase()}][${this.now()}]: ${message}`);
  }

  error(type: string, error: string): void {
    console.error(`[${type.toUpperCase()}][${this.now()}]: ${error}`);
  }
}

export default new Logger();
