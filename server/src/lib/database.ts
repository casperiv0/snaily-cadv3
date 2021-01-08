import mysql, { ConnectionConfig } from "promise-mysql";
import Logger from "./Logger";
const INTERVAL_5_SECS = 5000;

const options: ConnectionConfig = {
  host: "db",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
  timeout: 0,
};

export async function connect(): Promise<mysql.Connection> {
  return await mysql.createConnection(options);
}

export async function processQuery(query: string, data?: any): Promise<any[] | any> {
  try {
    const conn = await connect();
    const result = await conn.query(query, data);
    conn.end();
    return result;
  } catch (err) {
    Logger.error("DB_ERROR", err?.stack || err);
  }
}

const interval = setInterval(() => setTimeout(() => select1(), 15_000), INTERVAL_5_SECS);

async function select1() {
  await processQuery("SELECT 1").catch((e) => {
    clearInterval(interval);
    Logger.error("DB_ERROR", e);
  });
}
