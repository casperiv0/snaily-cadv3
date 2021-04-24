/* eslint-disable promise/always-return */
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import next from "next";
import config from "./lib/config.server";
import { socketHandler, wrap } from "./lib/socket.server";
import { logger } from "./lib/logger";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = express();

    httpServer.use("/static", express.static("public"));
    httpServer.all("*", (req, res) => handle(req, res));

    const socketServer = new SocketServer(
      httpServer.listen(config.port, () =>
        logger.log("APP", `Running on http://localhost:${config.port}/`),
      ),
    );

    socketServer.use(wrap(cookieParser()));
    socketServer.on("connection", (s) => socketHandler(s, socketServer));

    (global as any).io = socketServer;
  })
  .catch(console.error);
