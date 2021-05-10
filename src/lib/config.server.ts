interface ServerConfig {
  port: number;
  host: string;
  user: string;
  password: string;
  databaseName: string;
  jwtSecret: string;
  env: string;
  allowIframes: boolean;
  secureCookie: boolean;
  databasePort: number;
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
const defaultSecret = "super@cool#bongo!catqsd";
const empty = "";

let config: ServerConfig;

try {
  const conf = require("../config");
  config = {
    port: conf.default.port || defaultPort,
    host: conf.default.host || defaultHost,
    user: conf.default.user || defaultUser,
    password: conf.default.password || empty,
    databaseName: conf.default.databaseName || defaultDatabaseName,
    jwtSecret: conf.default.jwtSecret || defaultSecret,
    env: conf.default.env || defaultProfile,
    allowIframes: conf.default?.allowIframes ?? false,
    secureCookie: conf.default?.secureCookie ?? false,
    databasePort: conf.default?.databasePort ?? 3306,
  };
} catch (e) {
  config = {
    port: process.env.PORT ? Number(process.env.PORT) : defaultPort,
    host: process.env.DB_HOST || defaultHost,
    user: process.env.DB_USER || defaultUser,
    password: process.env.DB_PASSWORD || empty,
    databaseName: process.env.DB_NAME || defaultDatabaseName,
    jwtSecret: process.env.JWT_SECRET || defaultSecret,
    env: process.env.PROFILE || defaultProfile,
    allowIframes: process.env.ALLOW_IFRAMES === "true" ?? false,
    secureCookie: process.env.SECURE_COOKIE === "true" ?? false,
    databasePort: parseInt(process.env.DB_PORT!) ?? 3306,
  };
}

export default config;
