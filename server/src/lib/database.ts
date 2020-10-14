import mysql, { ConnectionConfig } from "promise-mysql";
import config from "../../config";
import Logger from "./Logger";

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

export async function processQuery(
  query: string,
  data?: any
): Promise<any[] | any> {
  const conn = await connect();
  const result = await conn.query(query, data);
  conn.end();
  return result;
}

setInterval(() => {
  processQuery("SELECT 1").catch((e) => Logger.error("DB_ERROR", e));
});
