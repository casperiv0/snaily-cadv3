import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { usePermission } from "@hooks/usePermission";
import { Citizen } from "types/Citizen";

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
    case "POST": {
      try {
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({
            error: formatRequired(["name"], req.body),
            status: "error",
          });
        }
        const [citizen] = await processQuery<Citizen>(
          "SELECT * FROM `citizens` WHERE `full_name` = ?",
          [name],
        );
        const citizenId = citizen?.id ?? "not_found";

        const [vehicles, weapons, warnings, arrestReports, tickets, warrants] = await Promise.all([
          processQuery("SELECT * FROM `registered_cars` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `written_warnings` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [citizenId]),
          processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [citizenId]),
        ]);

        return res.json({
          citizen: citizen,
          writtenWarnings: warnings,
          vehicles,
          weapons,
          arrestReports,
          tickets,
          warrants,
          status: "success",
        });
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
