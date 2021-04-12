import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { AnError } from "@lib/consts";
import { formatRequired } from "@lib/utils.server";
import { Citizen } from "types/Citizen";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "GET": {
      try {
        const requests = await processQuery("SELECT * FROM `court_requests` WHERE `user_id` = ?", [
          req.userId,
        ]);

        return res.json({
          status: "success",
          requests: requests.map((re: any) => {
            re.warrants = JSON.parse(re.warrants);
            re.arrestReports = JSON.parse(re.arrest_reports);
            re.tickets = JSON.parse(re.tickets);
            return re;
          }),
        });
      } catch (e) {
        return res.status(500).json({
          error: AnError,
          status: "error",
        });
      }
    }
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

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen not found",
            status: "error",
          });
        }

        if (citizen.user_id !== req.userId) {
          return res.status(401).json({
            error: "This citizen is not connected to your account",
            status: "error",
          });
        }

        const citizenId = citizen?.id ?? "not_found";

        const arrestReports = await processQuery(
          "SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?",
          [citizenId],
        );
        const tickets = await processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [
          citizenId,
        ]);
        const warrants = await processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [
          citizenId,
        ]);

        return res.json({ status: "success", tickets, warrants, arrestReports, citizenId });
      } catch (e) {
        return res.status(500).json({
          error: AnError,
          status: "error",
        });
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
