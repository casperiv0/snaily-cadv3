import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { formatRequired } from "@lib/utils.server";
import { v4 } from "uuid";

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
    await usePermission(req, ["ems_fd"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const deputies = await processQuery("SELECT * FROM `ems-fd` WHERE `user_id` = ?", [
          req.userId,
        ]);

        return res.json({ deputies, status: "success" });
      } catch (e) {
        logger.error("update_call", e);
        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { name, callsign } = req.body;

        if (!name || !callsign) {
          return res.status(400).json({
            error: formatRequired(["name", "callsign"], req.body),
            status: "error",
          });
        }

        const id = v4();
        await processQuery(
          "INSERT INTO `ems-fd` (`id`, `name`, `user_id`, `status`, `status2`, `callsign`) VALUES (?, ?, ?, ?, ?, ?)",
          [id, name, req.userId, "off-duty", "--------", callsign],
        );

        const updated = await processQuery("SELECT * FROM `ems-fd` WHERE `user_id` = ?", [
          req.userId,
        ]);
        return res.json({ status: "success", deputies: updated });
      } catch (e) {
        logger.error("update_call", e);
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
