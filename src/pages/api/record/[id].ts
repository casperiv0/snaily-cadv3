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
    await usePermission(req, ["leo", "dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const recordId = req.query.id;
        const { type, citizenId } = req.query;

        if (!type || !citizenId) {
          return res.status(400).json({
            error: "`type` & `citizenId` must be provided",
            status: "error",
          });
        }

        let citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

        switch (type) {
          case "ticket": {
            await processQuery("DELETE FROM `leo_tickets` WHERE `id` = ?", [recordId]);
            break;
          }
          case "arrest_report": {
            await processQuery("DELETE FROM `arrest_reports` WHERE `id` = ?", [recordId]);
            break;
          }
          case "written_warning": {
            await processQuery("DELETE FROM `written_warnings` WHERE `id` = ?", [recordId]);
            break;
          }
          case "warrant": {
            citizen = await processQuery("SELECT * FROM `citizens` WHERE `full_name` = ?", [
              citizenId,
            ]);
            await processQuery("DELETE FROM `warrants` WHERE `id` = ?", [recordId]);
            break;
          }
          default: {
            return res.status(400).json({
              error: "invalid type",
              status: "error",
            });
          }
        }

        const [vehicles, weapons, warnings, arrestReports, tickets, warrants] = await Promise.all([
          processQuery("SELECT * FROM `registered_cars` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `written_warnings` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [citizenId]),
        ]);

        return res.json({
          citizen: citizen[0],
          writtenWarnings: warnings,
          vehicles,
          weapons,
          arrestReports,
          tickets,
          warrants,
          status: "success",
        });
      } catch (e) {
        logger.error("delete_record", e);

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
