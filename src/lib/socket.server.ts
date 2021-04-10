import { Socket } from "socket.io";
import { useSocketAuth } from "../hooks/useSocketAuth";
import { ExtendedError } from "socket.io/dist/namespace";

export const wrap = (middleware: any) => (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
  return middleware(socket.request, {}, next);
};

export async function socketHandler(socket: Socket) {
  // @ts-expect-error ignore the line below
  const token = socket?.request?.cookies?.["snaily-cad-session"];

  // Check if the user is authenticated and exits in the database, if not close the connection
  try {
    await useSocketAuth(token);
    socket.emit("connection_success", "Successfully connected to socket");
  } catch (e) {
    socket.emit("connection_error", e);
    socket.disconnect(true);
  }
}
