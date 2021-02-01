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

export async function processQuery<T = any>(query: string, data?: any[]): Promise<T> {
  const conn = await connect();
  const result = await conn.query(query, data);
  conn.end();
  return result;
}

const interval = setInterval(select1, INTERVAL_5_SECS);

async function select1() {
  await processQuery("SELECT 1").catch((e) => {
    clearInterval(interval);
    Logger.error("DB_ERROR", e);
  });
}

async function updateDb() {
  try {
    await processQuery(
      "ALTER TABLE `users` ADD `taxi` VARCHAR(255) NOT NULL AFTER `whitelist_status`;ALTER TABLE `citizens` ADD `note` VARCHAR(255) NOT NULL AFTER `b_status`;ALTER TABLE `officers` ADD `callsign` VARCHAR(255) NOT NULL AFTER `officer_dept`;"
    );

    // eslint-disable-next-line no-empty
  } catch {}
}

updateDb();
