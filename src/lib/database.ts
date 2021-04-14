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

export async function processQuery<T = unknown>(
  query: string,
  data?: unknown[],
): Promise<(T | undefined)[]> {
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

async function updateLine(sql: string) {
  try {
    await processQuery(sql);
  } catch (e) {
    const saveCodes = ["ER_TABLE_EXISTS_ERROR", "ER_DUP_FIELDNAME", "ER_CANT_DROP_FIELD_OR_KEY"];
    if (saveCodes.includes(e.code)) return;

    console.log(e);
  }
}

async function updateDb() {
  updateLine(`
  CREATE TABLE \`seo_tags\` (
    \`title\` varchar(255) DEFAULT 'SnailyCAD',
    \`description\` text DEFAULT 'A free, fast, simple and secure open source CAD/MDT',
    \`site_name\` varchar(255) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

updateDb();
