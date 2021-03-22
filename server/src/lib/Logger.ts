import dateformat from "dateformat";
import chalk from "chalk";

class Logger {
  get now(): string {
    const now = new Date();
    return dateformat(now, "HH:MM:ss");
  }

  warn(type: string, warning: string): void {
    return console.warn(chalk.yellow(`[${type}][${this.now}]: ${warning}`));
  }

  error(type: string, error: string): void {
    return console.error(chalk.redBright(`[${type}][${this.now}]: ${error}`));
  }

  log(type: string, message: string): void {
    return console.log(`[${type}][${this.now}]: ${message}`);
  }

  throw(type: string, message: string): void {
    throw Error(`[${type}]: ${message}`);
  }
}

export default new Logger();
