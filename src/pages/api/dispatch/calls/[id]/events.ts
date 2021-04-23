import { NextApiResponse } from "next";
import { v4 } from "uuid";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { SocketEvents } from "types/Socket";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  try {
    await usePermission(req, ["dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "POST": {
      try {
        const { text } = req.body;

        const [call] = await processQuery("SELECT * FROM `911calls` WHERE `id` = ?", [
          req.query.id,
        ]);

        if (!call) {
          return res.status(404).json({
            error: "That call was not found",
            status: "error",
          });
        }

        await processQuery(
          "INSERT INTO `call_events` (`id`, `call_id`, `text`, `date`) VALUES (?, ?, ?, ?)",
          [v4(), req.query.id, text, Date.now()],
        );

        (global as any)?.io?.sockets?.emit?.(SocketEvents.Update911Calls);

        return res.json({
          status: "success",
        });
      } catch (e) {
        logger.error("add_call_event", e);
        return res.status(500).json(AnError);
      }
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
