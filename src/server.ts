/* eslint-disable promise/always-return */
import { Server as HttpServer } from "http";
import next from "next";
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import config from "./lib/config";
import { socketHandler, wrap } from "./lib/socket.server";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const httpServer = new HttpServer((req, res) => handle(req, res));

    const socketServer = new SocketServer(httpServer);
    socketServer.on("connection", socketHandler);
    socketServer.use(wrap(cookieParser()));

    httpServer.listen(config.port);
  })
  .catch(console.error);
