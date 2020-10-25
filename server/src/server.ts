import "./lib/checks";
import express, { Application, json } from "express";
import config from "../config";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import socketIO from "socket.io";
import Logger from "./lib/Logger";
import api from "./api";

const app: Application = express();
const port = config.port;
const server = app.listen(port, () => Logger.listening(port));
const io = socketIO(server);
const protection = csurf({ cookie: true });

app.use("/static", express.static("public"));
app.use(json());
app.use(fileUpload());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(helmet());
app.use("/api/v1", api, protection);

export { io };

import("./lib/socket");
