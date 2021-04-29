import { Server, Socket } from "socket.io";
import { useSocketAuth } from "../hooks/useSocketAuth.server";
import { ExtendedError } from "socket.io/dist/namespace";
import { processQuery } from "./database";
import { logger } from "./logger";
import config from "./config.server";
import { Perm } from "../interfaces/Perm";
import { Officer } from "../interfaces/Officer";
import { Cad } from "../interfaces/Cad";
import { getWebhookData, postWebhook } from "./utils.server";
import { SocketEvents } from "../interfaces/Socket";

export const wrap = (middleware: any) => (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) => {
  return middleware(socket.request, {}, next);
};

export async function socketHandler(socket: Socket, server: Server) {
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

  const [cadInfo] = await processQuery<Cad>("SELECT `webhook_url` FROM `cad_info`");

  socket.on(SocketEvents.UpdateActiveUnits, () => {
    server.sockets.emit(SocketEvents.UpdateActiveUnits);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.UpdateActiveUnits);
    }
  });

  socket.on(SocketEvents.CheckConnection, (value: boolean) => {
    if (value === true) {
      server.sockets.emit(SocketEvents.CheckConnection, true);
    }

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", "Checking connections...");
    }
  });

  socket.on(SocketEvents.Signal100, async (value: Perm) => {
    await processQuery("UPDATE `cad_info` set `signal_100` = ?", [value]);
    const [updated] = await processQuery<{ signal_100: string }>(
      "SELECT `signal_100` FROM `cad_info`",
    );

    server.sockets.emit(SocketEvents.Signal100, updated?.signal_100);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.Signal100);
    }
  });

  socket.on(SocketEvents.UpdateAop, (aop: string) => {
    server.sockets.emit(SocketEvents.UpdateAop, aop);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", `${SocketEvents.UpdateAop} - ${aop}`);
    }
  });

  socket.on(SocketEvents.Update911Calls, () => {
    server.sockets.emit(SocketEvents.Update911Calls);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.Update911Calls);
    }
  });

  socket.on(SocketEvents.UpdateTowCalls, () => {
    server.sockets.emit(SocketEvents.UpdateTowCalls);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.UpdateTowCalls);
    }
  });

  socket.on(SocketEvents.UpdateTaxiCalls, () => {
    server.sockets.emit(SocketEvents.UpdateTaxiCalls);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.UpdateTaxiCalls);
    }
  });

  socket.on(SocketEvents.UpdateBolos, () => {
    server.sockets.emit(SocketEvents.UpdateBolos);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.UpdateBolos);
    }
  });

  socket.on(SocketEvents.UpdateAssignedUnits, (unitIds) => {
    server.sockets.emit(SocketEvents.UpdateAssignedUnits, unitIds);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.UpdateAssignedUnits);
    }
  });

  socket.on(SocketEvents.PanicButton, (officer: Officer) => {
    server.sockets.emit(SocketEvents.PanicButton, officer);

    if (config.env === "dev") {
      logger.log("SOCKET_EVENT", SocketEvents.PanicButton);
    }
  });

  socket.on(
    SocketEvents.New911Call,
    async (callData: { description: string; caller: string; location: string }) => {
      if (!callData) return;
      server.sockets.emit(SocketEvents.New911Call, callData);

      if (cadInfo?.webhook_url) {
        if (cadInfo?.webhook_url === "0") return;

        const webhook = await getWebhookData(cadInfo.webhook_url);

        if (webhook) {
          await postWebhook(
            {
              type: 1,
              id: webhook.id,
              token: webhook.token,
              avatar: null,
              name: webhook.name,
              channel_id: webhook.channel_id,
              guild_id: webhook.guild_id,
            },
            {
              username: webhook.name,
              embeds: [
                {
                  title: "New 911 Call",
                  type: "rich",
                  description: callData.description,
                  fields: [
                    {
                      name: "Caller",
                      value: callData.caller,
                      inline: true,
                    },
                    {
                      name: "Location",
                      value: callData.location,
                      inline: true,
                    },
                  ],
                },
              ],
              avatar_url: webhook.avatar,
            },
          );
        }
      }

      if (config.env === "dev") {
        logger.log("SOCKET_EVENT", SocketEvents.New911Call);
      }
    },
  );
}
