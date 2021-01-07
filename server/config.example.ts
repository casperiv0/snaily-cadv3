const config = {
  port: 3030,
  clientUrl: "http://localhost:5000",
  host: "db", //! DO NOT CHANGE WHEN USING DOCKER.
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  databaseName: process.env.MYSQL_DATABASE,
  jwtSecret: "bongo super cat",
  env: "production" /* Do NOT change this unless you know what you are doing! */,
};

export default config;
