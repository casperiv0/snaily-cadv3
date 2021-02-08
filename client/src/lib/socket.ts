import { io } from "socket.io-client";
import Logger from "./Logger";

const socket = io();
const INTERVAL_1_MIN = 60_000; /* 1 minute interval */

socket.on("connect", () => {
  Logger.log("socket", `Connected to socket`);
  socket.emit("CHECK_FOR_VERSION");
});

socket.on("VERSION_CHECK", (currentVersion: string, updatedVersion: string) => {
  Logger.log(
    "VERSION",
    `
Your version: ${currentVersion}
Updated version: ${updatedVersion}`,
  );
});

setInterval(() => {
  socket.emit("CHECK_CONNECTION", true);
}, INTERVAL_1_MIN);

export default socket;
