import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
import { usePermission } from "hooks/usePermission";
import { Citizen } from "types/Citizen";
import { parseCitizens } from "../citizen";
import { Tables } from "types/Tables";

async function selectAllFrom(table: Tables, citizenId: string) {
  return global.connection.query().select("*").from(table).where("citizen_id", citizenId).exec();
}

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

        const [citizen] = await parseCitizens(
          await global.connection
            .query<Citizen>()
            .select("*")
            .from("citizens")
            .where("full_name", name)
            .exec(),
        );

        const citizenId = citizen?.id ?? "not_found";

        const [vehicles, weapons, warnings, arrestReports, tickets, warrants] = await Promise.all([
          selectAllFrom("registered_cars", citizenId),
          selectAllFrom("registered_weapons", citizenId),
          selectAllFrom("written_warnings", citizenId),
          selectAllFrom("arrest_reports", citizenId),
          selectAllFrom("leo_tickets", citizenId),
          selectAllFrom("warrants", citizenId),
        ]);

        return res.json({
          citizen,
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
