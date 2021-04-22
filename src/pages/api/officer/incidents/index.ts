import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { formatRequired, getActiveOfficer } from "@lib/utils.server";
import { v4 } from "uuid";
import { OfficerIncident } from "types/OfficerIncident";

export const formatIncidents = (incidents: OfficerIncident[]) => {
  return incidents.map((inc) => {
    try {
      inc.involved_officers = JSON.parse(inc.involved_officers as string);
    } catch {
      inc.involved_officers = [];
    }

    return inc;
  });
};

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
    await usePermission(req, ["leo", "admin", "moderator", "owner"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const incidents = await processQuery("SELECT * FROM `leo_incidents`");

        return res.json({
          incidents: formatIncidents(incidents as OfficerIncident[]),
          status: "success",
        });
      } catch (e) {
        logger.error("get_incidents", e);
        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const {
          full_date,
          narrative,
          involved_officers,
          location,
          arrests_made,
          firearms_involved,
          injuries,
        } = req.body as OfficerIncident;

        if (
          !full_date ||
          !narrative ||
          !location ||
          !arrests_made ||
          !firearms_involved ||
          !injuries
        ) {
          return res.status(400).json({
            error: formatRequired(
              [
                "full_date",
                "narrative",
                "location",
                "arrests_made",
                "firearms_involved",
                "injuries",
              ],
              req.body,
            ),
            status: "error",
          });
        }

        const officer = await getActiveOfficer(req);

        if (!officer) {
          return res.status(401).json({
            error: "You need to be on-duty todo that!",
            status: "error",
          });
        }

        const total = await processQuery("SELECT * FROM `leo_incidents`");

        await processQuery(
          "INSERT INTO `leo_incidents` (`id`, `full_date`, `narrative`, `involved_officers`, `location`, `officer_name`, `officer_dept`, `case_number`, `officer_id`, `firearms_involved`, `arrests_made`, `injuries`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            v4(),
            full_date,
            narrative,
            JSON.stringify(involved_officers),
            location,
            `${officer.callsign} ${officer.officer_name}`,
            officer.officer_dept,
            total.length + 1,
            officer.id,
            arrests_made,
            firearms_involved,
            injuries,
          ],
        );

        const incidents = await processQuery<OfficerIncident>("SELECT * FROM `leo_incidents`");
        return res.json({
          incidents: formatIncidents(incidents as OfficerIncident[]),
          status: "success",
        });
      } catch (e) {
        logger.error("get_incidents", e);
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
