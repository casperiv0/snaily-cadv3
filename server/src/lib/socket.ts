import config from "../../config";
import Logger from "./Logger";
import { io } from "../server";

io.on("connection", (socket) => {
  socket.on("UPDATE_ACTIVE_UNITS", () => {
    io.sockets.emit("UPDATE_ACTIVE_UNITS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_ACTIVE_UNITS");
    }
  });

  socket.on("CHECK_CONNECTION", (value) => {
    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "Checking connections...");

      if (value === true) {
        io.sockets.emit("CHECK_CONNECTION", true);
      }
    }
  });

  socket.on("UPDATE_AOP", (aop) => {
    io.sockets.emit("UPDATE_AOP", aop);

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", `UPDATE_AOP - ${aop}`);
    }
  });

  socket.on("UPDATE_911_CALLS", () => {
    io.sockets.emit("UPDATE_911_CALLS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_911_CALLS");
    }
  });
});
