/* eslint-disable promise/always-return */
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import next from "next";
import config from "./lib/config.server";
import { socketHandler, wrap } from "./lib/socket.server";
import { logger } from "./lib/logger";
import express from "express";
import { checkVersion } from "./lib/version.server";
import { Connection } from "@casper124578/mysql.ts";
import { Tables } from "./interfaces/Tables";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

declare global {
  namespace NodeJS {
    interface Global {
      CAD_VERSION: string;
      io: SocketServer | undefined;
      connection: Connection<Tables>;
    }
  }
}

// this is important. Keep!
process.env.NEXT_PUBLIC_SECURE_COOKIES = `${config.secureCookie}`;
process.env.NEXT_PUBLIC_CUSTOM_HOST = `${config.customHostUrl}`;

app
  .prepare()
  .then(async () => {
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
    // eslint-disable-next-line promise/no-nesting
    const version = await checkVersion(true).catch(() => null);

    if (version) {
      global.CAD_VERSION = version;
    }

    global.io = socketServer;
  })
  .catch(console.error);
