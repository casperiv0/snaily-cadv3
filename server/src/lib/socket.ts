import config from "../../config";
import Logger from "./Logger";
import { io } from "../server";
import { getWebhookData, postWebhook, WebHook } from "./functions";
import { processQuery } from "./database";
import { Socket } from "socket.io";

io.on("connection", async (socket: Socket) => {
  const cadInfo = await processQuery("SELECT `webhook_url` FROM `cad_info`");
  let webhook = {} as WebHook;
  if (cadInfo[0]?.webhook_url) {
    webhook = await getWebhookData(cadInfo[0].webhook_url);
  }

  socket.on("UPDATE_ACTIVE_UNITS", () => {
    io.sockets.emit("UPDATE_ACTIVE_UNITS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_ACTIVE_UNITS");
    }
  });

  socket.on("CHECK_CONNECTION", (value: boolean) => {
    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "Checking connections...");

      if (value === true) {
        io.sockets.emit("CHECK_CONNECTION", true);
      }
    }
  });

  socket.on("UPDATE_AOP", (aop: string) => {
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

  socket.on("UPDATE_TOW_CALLS", () => {
    io.sockets.emit("UPDATE_TOW_CALLS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_TOW_CALLS");
    }
  });

  socket.on("UPDATE_BOLOS", () => {
    io.sockets.emit("UPDATE_BOLOS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_BOLOS");
    }
  });

  socket.on(
    "NEW_911_CALL",
    async (callData: { description: string; caller: string; location: string }) => {
      io.sockets.emit("NEW_911_CALL", callData);

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
          }
        );
      }

      if (config.env === "dev") {
        Logger.log("SOCKET_EVENT", "NEW_911_CALL");
      }
    }
  );
});
