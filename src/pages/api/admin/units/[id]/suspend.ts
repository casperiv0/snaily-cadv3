import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { Officer } from "types/Officer";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  try {
    await usePermission(req, ["admin", "owner", "moderator", "supervisor"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const unitId = req.query.id;
        const type = req.query.type;

        if (!type) {
          return res.status(400).json({
            error: "`type` is required",
            status: "error",
          });
        }

        if (!["0", "1"].includes(`${type}`)) {
          return res.status(400).json({
            error: "`type` must be 1 or 0",
            status: "error",
          });
        }

        const [unit] = await processQuery<Officer>("SELECT * FROM `officers` WHERE `id` = ?", [
          unitId,
        ]);

        if (!unit) {
          return res.status(404).json({
            error: "Unit was not found",
            status: "error",
          });
        }

        await processQuery("UPDATE `officers` SET `suspended` = ? WHERE `id` = ?", [type, unitId]);

        const officers = await processQuery("SELECT * FROM `officers`");
        const ems_fd = await processQuery("SELECT * FROM `ems-fd`");

        return res.json({ status: "success", officers, ems_fd });
      } catch (e) {
        logger.error("update_unit_by_id", e);

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
