import { io } from "socket.io-client";
import { logger } from "@lib/logger";
import { SocketEvents } from "types/Socket";

const socket = io("/", {
  withCredentials: true,
});

const INTERVAL_1_MIN = 60 * 1000;

socket.on("connect", () => {});

socket.on(SocketEvents.ConnectionSuccess, (e) => {
  logger.log("socket", `${e}. ID: ${socket.id}`);
});

socket.on(SocketEvents.ConnectionError, (error) => {
  if (error.status === "error") {
    logger.error("SOCKET", `Disconnected from socket. Error: ${error.error}`);

    // Disconnect from socket if user is not authenticated
    socket.close();
  }
});

setInterval(() => {
  socket.emit(SocketEvents.CheckConnection, true);
}, INTERVAL_1_MIN);

export default socket;
