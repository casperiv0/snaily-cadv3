import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { OfficerIncident } from "types/OfficerIncident";
import { formatIncidents } from ".";

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
    await usePermission(req, ["admin", "moderator", "owner"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        await processQuery("DELETE FROM `leo_incidents` WHERE `id` = ?", [req.query.id]);

        const incidents = await processQuery("SELECT * FROM `leo_incidents`");
        return res.json({
          incidents: formatIncidents(incidents as OfficerIncident[]),
          status: "success",
        });
      } catch (e) {
        logger.error("delete_incident", e);
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
