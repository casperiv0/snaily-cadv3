import * as React from "react";
import { io, Socket } from "socket.io-client";
import { logger } from "@lib/logger";
import { SocketEvents } from "types/Socket";
import { Nullable } from "types/State";

const INTERVAL_1_MIN = 60 * 1000;

let socket: Nullable<Socket> = null;

export function useSocket() {
  const [s, setSocket] = React.useState<Nullable<Socket>>(socket);

  React.useEffect(() => {
    if (!socket) {
      const createdSocket = io("/", {
        withCredentials: true,
      });

      socket = createdSocket;
      setSocket(createdSocket);
      doSocketStuff(socket);
    }
  }, []);

  return React.useMemo(() => s, [s]);
}

function doSocketStuff(socket: Nullable<Socket>) {
  socket?.on("connect", () => {});

  socket?.on(SocketEvents.ConnectionSuccess, (e) => {
    logger.log("socket", `${e}. ID: ${socket?.id}`);
  });

  socket?.on(SocketEvents.ConnectionError, (error) => {
    if (error.status === "error") {
      logger.error("SOCKET", `Disconnected from socket. Error: ${error.error}`);

      // Disconnect from socket if user is not authenticated
      socket?.close();
    }
  });

  setInterval(() => {
    socket?.emit(SocketEvents.CheckConnection, true);
  }, INTERVAL_1_MIN);
}
