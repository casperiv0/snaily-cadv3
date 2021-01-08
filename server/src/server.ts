import "./lib/checks";
import express, { Application, json } from "express";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import Logger from "./lib/Logger";
import api from "./api";

const app: Application = express();
const port = 3030;
const server = app.listen(port, () => Logger.listening(port));
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const protection = csurf({ cookie: true });

app.use("/static", express.static("public"));
app.use(json());
app.use(fileUpload());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(helmet());
app.use("/api/v1", api, protection);

export { io };

import("./lib/socket");
