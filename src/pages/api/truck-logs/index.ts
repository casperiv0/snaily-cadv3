import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { v4 } from "uuid";
import { formatRequired } from "@lib/utils.server";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const logs = await processQuery("SELECT * FROM `truck_logs` WHERE `user_id` = ?", [
          req.userId,
        ]);

        return res.json({ status: "success", logs });
      } catch (e) {
        logger.error("cad-info", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      const { name, date, co_driver, start_time, plate } = req.body;
      const id = v4();

      if (!name || !date || !start_time || !plate) {
        return res.status(400).json({
          error: formatRequired(["name", "date", "co_driver", "start_time", "plate"], req.body),
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `truck_logs` (`id`, `name`, `timestamp`, `co_driver`, `start_time`, `plate`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, name, date, co_driver ?? "None", start_time, plate, req.userId],
      );

      const logs = await processQuery("SELECT * FROM `truck_logs` WHERE `user_id` = ?", [
        req.userId,
      ]);

      return res.json({ status: "success", logs });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
