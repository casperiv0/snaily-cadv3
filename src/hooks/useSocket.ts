import { io } from "socket.io-client";
import { logger } from "@lib/logger";
import { SocketEvents } from "types/Socket";

const socket = io("/", {
  withCredentials: true,
});
const CHECK_CONN_INTERVAL = 8_000; /* 8 seconds interval */

socket?.on("connect", () => {
  socket?.emit("CHECK_FOR_VERSION");
});

socket?.on(SocketEvents.ConnectionSuccess, (e) => {
  logger.log("socket", `${e}. ID: ${socket.id}`);
});

socket?.on(SocketEvents.ConnectionError, (error) => {
  if (error.status === "error") {
    logger.error("SOCKET", `Disconnected from socket. Error: ${error.error}`);

    // disconnect from socket if user is not authenticated
    socket.close();
  }
});

setInterval(() => {
  socket.emit(SocketEvents.CheckConnection, true);
}, CHECK_CONN_INTERVAL);

export { socket };
