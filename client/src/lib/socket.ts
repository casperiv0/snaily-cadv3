import { io } from "socket.io-client";
import Logger from "./Logger";
import { SOCKET_EVENTS } from "./types";

const url = process.env.REACT_APP_IS_DEV === "true" ? process.env.REACT_APP_SERVER_URL! : "";

const socket = io(url, {
  withCredentials: true,
});
const INTERVAL_1_MIN = 60_000; /* 1 minute interval */

socket.on("connect", () => {
  socket.emit("CHECK_FOR_VERSION");
});

socket.on(SOCKET_EVENTS.CONNECTION_SUCCESS, (e) => {
  Logger.log("socket", `${e}. ID: ${socket.id}`);
});

socket.on(SOCKET_EVENTS.CONNECTION_ERROR, (error) => {
  if (error.status === "error") {
    Logger.error("SOCKET", `Disconnected from socket. Error: ${error.error}`);

    // Disconnect from socket if user is not authenticated
    socket.close();
  }
});

setInterval(() => {
  socket.emit(SOCKET_EVENTS.CHECK_CONNECTION, true);
}, INTERVAL_1_MIN);

export default socket;
