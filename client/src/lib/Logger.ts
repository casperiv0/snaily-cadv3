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

  warn(type: string, message: string): void {
    console.warn(`[${type.toUpperCase()}][${this.now()}]: ${message}`);
  }
}

export default new Logger();
