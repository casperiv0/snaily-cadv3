import config from "../../config";
import Logger from "./Logger";
import { io } from "../server";

io.on("connection", (socket) => {
  socket.on("UPDATE_ACTIVE_UNITS", () => {
    io.sockets.emit("UPDATE_ACTIVE_UNITS");
  });

  socket.on("CHECK_CONNECTION", (value) => {
    if (config.env === "dev") {
      Logger.log("SOCKET", "Checking connections...");

      if (value === true) {
        io.sockets.emit("CHECK_CONNECTION", true);
      }
    }
  });
});
