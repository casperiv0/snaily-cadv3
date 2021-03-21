interface ServerConfig {
  port: number;
  host: string;
  user: string;
  password: string;
  databaseName: string;
  jwtSecret: string;
  env: string;
}

/**
 *! WARNING!
 *! Do not change the values in this file.
 */

const defaultPort = 3030;
const defaultHost = "localhost";
const defaultUser = "root";
const defaultDatabaseName = "snaily-cad";
const defaultProfile = "production";
const empty = "";

let config: ServerConfig;

try {
  const conf = require("../../config");
  config = {
    port: conf.default.port || defaultPort,
    host: conf.default.host || defaultHost,
    user: conf.default.user || defaultUser,
    password: conf.default.password || empty,
    databaseName: conf.default.databaseName || defaultDatabaseName,
    jwtSecret: conf.default.jwtSecret || empty,
    env: conf.default.env || defaultProfile,
  };
} catch (_) {
  config = {
    port: process.env.PORT ? Number(process.env.PORT) : defaultPort,
    host: process.env.DB_HOST || defaultHost,
    user: process.env.DB_USER || defaultUser,
    password: process.env.DB_PASSWORD || empty,
    databaseName: process.env.DB_NAME || defaultDatabaseName,
    jwtSecret: process.env.JWT_SECRET || empty,
    env: process.env.PROFILE || defaultProfile,
  };
}

export default config;
