import { io, Socket } from "socket.io-client";
import { logger } from "@lib/logger";
import { SocketEvents } from "types/Socket";

let socket = {} as Socket;

if (!socket?.id) {
  socket = io("/", {
    withCredentials: true,
  });
}
const INTERVAL_1_MIN = 60_000; /* 1 minute interval */

socket?.on("connect", () => {
  socket?.emit("CHECK_FOR_VERSION");
});

socket?.on(SocketEvents.ConnectionSuccess, (e) => {
  logger.log("socket", `${e}. ID: ${socket.id}`);
});

socket?.on(SocketEvents.ConnectionError, (error) => {
  if (error.status === "error") {
    logger.error("SOCKET", `Disconnected from socket. Error: ${error.error}`);

    // Disconnect from socket if user is not authenticated
    socket.close();
  }
});

setInterval(() => {
  socket.emit(SocketEvents.CheckConnection, true);
}, INTERVAL_1_MIN);

export { socket };
