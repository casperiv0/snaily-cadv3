import mysql, { Connection, ConnectionConfig } from "promise-mysql";
import config from "./config.server";
import { logger } from "./logger";

const INTERVAL_5_SECS = 5 * 1000;
const options: ConnectionConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: "snaily-cad",
};

async function connect(): Promise<Connection> {
  return await mysql.createConnection(options);
}

export async function processQuery<T = unknown>(query: string, data?: unknown[]): Promise<T[]> {
  const connection = await connect();

  try {
    return connection.query(query, data);
  } finally {
    connection && connection.end();
  }
}

// keep connection open.
const interval = setInterval(select1, INTERVAL_5_SECS);

async function select1() {
  await processQuery("SELECT 1").catch((e) => {
    clearInterval(interval);
    logger.error("DB_ERROR", e);
  });
}
