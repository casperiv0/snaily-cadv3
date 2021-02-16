import config from "../../config";
import Logger from "./Logger";
import { io } from "../server";
import { getWebhookData, postWebhook } from "./functions";
import { processQuery } from "./database";
import { Socket } from "socket.io";
import Officer from "../interfaces/Officer";
import { checkVersion } from "./checks";
import { Perm } from "../interfaces/IUser";

io.on("connection", async (socket: Socket) => {
  const cadInfo = await processQuery("SELECT `webhook_url` FROM `cad_info`");

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

  socket.on("SIGNAL_100", async (value: Perm) => {
    await processQuery("UPDATE `cad_info` set `signal_100` = ?", [value]);
    const updated = await processQuery("SELECT `signal_100` FROM `cad_info`");

    io.sockets.emit("SIGNAL_100", updated[0].signal_100);

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "SIGNAL_100");
    }
  });

  socket.on("CHECK_FOR_VERSION", () => {
    checkVersion(true);
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

  socket.on("UPDATE_TAXI_CALLS", () => {
    io.sockets.emit("UPDATE_TAXI_CALLS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_TAXI_CALLS");
    }
  });

  socket.on("UPDATE_BOLOS", () => {
    io.sockets.emit("UPDATE_BOLOS");

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_BOLOS");
    }
  });

  socket.on("UPDATE_ASSIGNED_UNITS", (unitIds) => {
    io.sockets.emit("UPDATE_ASSIGNED_UNITS", unitIds);

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "UPDATE_ASSIGNED_UNITS");
    }
  });

  socket.on("PANIC_BUTTON", (officer: Officer) => {
    io.sockets.emit("PANIC_BUTTON", officer);

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "PANIC_BUTTON");
    }
  });

  socket.on("END_911_CALL", (callId: string) => {
    io.sockets.emit("END_911_CALL", callId);

    if (config.env === "dev") {
      Logger.log("SOCKET_EVENT", "END_911_CALL");
    }
  });

  socket.on("NEW_911_CALL", async (callData: { description: string; caller: string; location: string }) => {
    io.sockets.emit("NEW_911_CALL", callData);

    if (cadInfo[0]?.webhook_url) {
      if (cadInfo[0]?.webhook_url === "0") return;

      const webhook = await getWebhookData(cadInfo[0].webhook_url);

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
      Logger.log("SOCKET_EVENT", "NEW_911_CALL");
    }
  });
});
