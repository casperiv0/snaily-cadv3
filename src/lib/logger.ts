import format from "date-fns/format";

class Logger {
  get now() {
    return format(Date.now(), "yyyy-MM-dd HH:mm:ss");
  }

  error(type: string, error: Error | unknown) {
    console.error(
      `[${type.toUpperCase()}][${this.now}]: ${
        error instanceof Error ? error?.stack : error || error
      }`,
    );
  }

  log(type: string, message: string) {
    console.log(`[${type.toUpperCase()}][${this.now}]: ${message}`);
  }
}

export const logger = new Logger();
