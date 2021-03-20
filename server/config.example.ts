const config = {
  port: Number(process.env.PORT) || 3030,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  databaseName: process.env.DB_NAME || "snaily-cad",
  jwtSecret: process.env.JWT_SECRET || "bongo super cat" /* change this to a long random string of numbers and characters */,
  env: process.env.PROFILE || "production" /* Do NOT change this unless you know what you are doing! */,
};

export default config;
