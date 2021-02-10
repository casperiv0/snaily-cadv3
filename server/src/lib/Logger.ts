import dateformat from "dateformat";

class Logger {
  now(): string {
    const now = new Date();
    return dateformat(now, "HH:MM:ss");
  }

  listening(port: number): void {
    return console.log(`[MAIN][${this.now()}]: CAD IS RUNNING ON ${port}`);
  }

  connected(): void {
    return console.log(`[DATABASE][${this.now()}]: CONNECTED TO DATABASE`);
  }

  error(type: string, error: string): void {
    return console.error(`[${type}][${this.now()}]: ${error}`);
  }

  log(type: string, message: string): void {
    return console.log(`[${type}][${this.now()}]: ${message}`);
  }

  throw(type: string, message: string): void {
    throw Error(`[${type}]: ${message}`);
  }
}

export default new Logger();
