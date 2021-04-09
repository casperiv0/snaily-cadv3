class Logger {
  get now() {
    return "";
  }

  error(type: string, error: Error | string) {
    console.error(
      `[${type.toUpperCase()}][${this.now}]: ${typeof error === "string" ? error : error.stack}`,
    );
  }

  log(type: string, message: string) {
    console.log(`[${type.toUpperCase()}][${this.now}]: ${message}`);
  }
}

export const logger = new Logger();
