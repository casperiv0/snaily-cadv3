import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { usePermission } from "@hooks/usePermission";

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
    await usePermission(req, ["leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "GET": {
      try {
        const officers = await processQuery("SELECT * FROM `officers` WHERE `user_id` = ?", [
          req.userId,
        ]);

        return res.json({ officers, status: "success" });
      } catch (e) {
        logger.error("name_search", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { name, department, callsign } = req.body;
        const id = v4();

        if (!name || !department || !callsign) {
          return res.status(400).json({
            error: formatRequired(["name", "department", "callsign"], req.body),
            status: "error",
          });
        }

        await processQuery(
          "INSERT INTO `officers` (`id`, `officer_name`,`officer_dept`,`callsign`,`user_id`,`status`,`status2`,`rank`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, name, department, callsign, req.userId, "off-duty", "", "officer"],
        );

        const officers = await processQuery("SELECT * FROM `officers` WHERE `user_id` = ?", [
          req.userId,
        ]);
        return res.json({ status: "success", officers });
      } catch (e) {
        logger.error("name_search", e);

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
