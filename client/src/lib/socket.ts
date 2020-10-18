import socketIO from "socket.io-client";
import SERVER_URL from "../config";
import Logger from "./Logger";

const socket = socketIO(SERVER_URL);

socket.on("connect", () => {
  Logger.log("socket", `Connected to ID ${socket.id}`);
});

setInterval(() => {
  socket.emit("CHECK_CONNECTION", true);
}, 5000);

export default socket;
