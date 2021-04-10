import format from "date-fns/format";

class Logger {
  get now() {
    return format(Date.now(), "yyyy-MM-dd hh:mm:ss");
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
