import socketIO from "socket.io-client";
import SERVER_URL from "../config";
import Logger from "./Logger";

const socket = socketIO(SERVER_URL);
const INTERVAL_1_MIN = 60000; /* 1 minute interval */

socket.on("connect", () => {
  Logger.log("socket", `Connected to ID ${socket.id}`);
});

setInterval(() => {
  socket.emit("CHECK_CONNECTION", true);
}, INTERVAL_1_MIN);

export default socket;
