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
    case "GET": {
      try {
        let [unit] = await processQuery("SELECT * FROM `officers` WHERE `id` = ?", [req.query.id]);

        if (!unit) {
          unit = await (
            await processQuery("SELECT * FROM `ems-fd` WHERE `id` = ?", [req.query.id])
          )?.[0];
        }

        if (!unit) {
          return res.status(404).json({
            error: "Unit not found",
            status: "error",
          });
        }

        const logs = await processQuery("SELECT * FROM `officer_logs` WHERE `officer_id` = ?", [
          req.query.id,
        ]);

        return res.json({ status: "success", unit, logs });
      } catch (e) {
        logger.error("get_unit_by_id", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const unitId = req.query.id;
        const { callsign, rank, department, status } = req.body;
        let { status2 } = req.body;

        if (status2 && status && status === "off-duty") {
          status2 = "--------";
        }

        let [unit] = await processQuery<Officer>("SELECT * FROM `officers` WHERE `id` = ?", [
          unitId,
        ]);
        if (!unit) {
          unit = await (
            await processQuery<any>("SELECT * FROM `ems-fd` WHERE `id` = ?", [unitId])
          )?.[0];
        }
        if (!unit) {
          return res.status(404).json({
            error: "Unit not found",
            status: "error",
          });
        }

        if (unit.officer_name) {
          if (!callsign || !department) {
            return res.status(400).json({
              error: "Please fill in all fields",
              status: "error",
            });
          }

          await processQuery(
            "UPDATE `officers` SET `callsign` = ?, `rank` = ?, `officer_dept` = ? WHERE `id` = ?",
            [callsign, rank, department, unitId],
          );

          if (status && status2) {
            await processQuery("UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
              status,
              status2,
              unitId,
            ]);
          }
        } else {
          if (status && status2) {
            await processQuery(
              "UPDATE `ems-fd` SET `status` = ?, `status2` = ?, `callsign` = ? WHERE `id` = ?",
              [status, status2, callsign, unitId],
            );
          }
        }

        return res.json({ status: "success" });
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
