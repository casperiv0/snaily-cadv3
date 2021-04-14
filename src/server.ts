/* eslint-disable promise/always-return */
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import next from "next";
import config from "./lib/config.server";
import { socketHandler, wrap } from "./lib/socket.server";
import { logger } from "./lib/logger";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = new HttpServer((req, res) => handle(req, res));

    const socketServer = new SocketServer(httpServer);
    socketServer.use(wrap(cookieParser()));
    socketServer.on("connection", (s) => socketHandler(s, socketServer));

    httpServer.listen(config.port, () =>
      logger.log("APP", `Running on http://localhost:${config.port}/`),
    );
  })
  .catch(console.error);
