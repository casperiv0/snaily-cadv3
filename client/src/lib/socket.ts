import { io } from "socket.io-client";
import Logger from "./Logger";

const url = process.env.REACT_APP_IS_DEV === "true" ? process.env.REACT_APP_SERVER_URL! : "";

const socket = io(url);
const INTERVAL_1_MIN = 60_000; /* 1 minute interval */

socket.on("connect", () => {
  Logger.log("socket", `Connected to socket. ID: ${socket.id}`);
  socket.emit("CHECK_FOR_VERSION");
});

setInterval(() => {
  socket.emit("CHECK_CONNECTION", true);
}, INTERVAL_1_MIN);

export default socket;
