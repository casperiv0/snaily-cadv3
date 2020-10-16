import socketIO from "socket.io-client";
import SERVER_URL from "../config";

const socket = socketIO(SERVER_URL);


socket.on("connect", () => {
    console.log(`Connected to ID ${socket.id}`)
})

export default socket;
