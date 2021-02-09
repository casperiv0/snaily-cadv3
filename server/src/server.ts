import "./lib/checks";
import "dotenv/config";
import express, { Application, Response } from "express";
import path from "path";

import csurf from "csurf";
import { Server } from "socket.io";
import Logger from "./lib/Logger";
import api from "./api";
import config from "../config";

const app: Application = express();
const port = config.port;
const server = app.listen(port, () => Logger.listening(port));

const io = new Server(server, {
  cors: {
    origin: process.env.IS_DEV === "true" ? process.env.CLIENT_URL : "same-site",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const protection = csurf({ cookie: true });
app.use("/api/v1", api, protection);

app.use("/static", express.static("public"));
app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("/*", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

export { io };

import("./lib/socket");
