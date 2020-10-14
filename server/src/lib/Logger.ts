import dateformat from "dateformat";
const now = new Date();

class Logger {
  now(): string {
    return dateformat(now, "HH:MM:ss");
  }

  listening(port: number): void {
    return console.log(`[MAIN][${this.now()}]: SERVER RUNNING ON ${port}`);
  }

  connected(): void {
    return console.log(`[DATABASE][${this.now()}]: CONNECTED TO DATABASE`);
  }

  error(type: string, error: string): void {
    return console.log(`[${type}][${this.now()}]:  ${error}`);
  }
}

export default new Logger();
