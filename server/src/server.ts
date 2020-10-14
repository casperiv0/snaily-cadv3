import express, { Application, json } from "express";
import config from "../config";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import Logger from "./lib/Logger";
import api from "./api";

const app: Application = express();
const port = config.port;

app.use(json());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use("/api/v1", api);

app.listen(port, () => Logger.listening(port));
