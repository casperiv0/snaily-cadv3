import { io } from "socket.io-client";
import Logger from "./Logger";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const socket = io(`${SERVER_URL}`);
const INTERVAL_1_MIN = 60000; /* 1 minute interval */

socket.on("connect", () => {
  Logger.log("socket", `Connected to socket`);
});

setInterval(() => {
  socket.emit("CHECK_CONNECTION", true);
}, INTERVAL_1_MIN);

export default socket;
