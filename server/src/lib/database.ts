import mysql, { ConnectionConfig } from "promise-mysql";
import config from "../../config";
import Logger from "./Logger";
const INTERVAL_5_SECS = 5000;

const options: ConnectionConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.databaseName,
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
