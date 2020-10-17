import socketIO from "socket.io-client";
import SERVER_URL from "../config";
import Logger from "./Logger";

const socket = socketIO(SERVER_URL);

socket.on("connect", () => {
  Logger.log("socket", `Connected to ID ${socket.id}`);
});

export default socket;
