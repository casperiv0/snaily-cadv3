class Logger {
  get now() {
    return "";
  }

  error(type: string, error: Error | string) {
    console.error(
      `[${type.toUpperCase()}][${this.now}]: ${typeof error === "string" ? error : error.stack}`,
    );
  }
}

export const logger = new Logger();
