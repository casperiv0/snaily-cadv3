import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
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
    await usePermission(req, ["dispatch", "leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const { type } = req.body;

        if (!type || !["0", "1"].includes(type)) {
          return res.status(400).json({
            error: "The must be provided",
            status: "error",
          });
        }

        await processQuery("UPDATE `citizens` SET `is_dangerous` = ? WHERE `id` = ?", [
          type,
          req.query.citizenId,
        ]);

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("set_citizen_danger", e);

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
