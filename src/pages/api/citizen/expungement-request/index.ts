import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
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
        const requests = await global.connection
          .query()
          .select("*")
          .from("court_requests")
          .where("user_id", req.userId)
          .exec();

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

        const [citizen] = await global.connection
          .query<Citizen>()
          .select("*")
          .from("citizens")
          .where("full_name", name)
          .exec();

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

        const arrestReports = await global.connection
          .query()
          .select("*")
          .from("arrest_reports")
          .where("citizen_id", citizenId)
          .exec();

        const tickets = await global.connection
          .query()
          .select("*")
          .from("leo_tickets")
          .where("citizen_id", citizenId)
          .exec();

        const warrants = await global.connection
          .query()
          .select("*")
          .from("warrants")
          .where("citizen_id", citizenId)
          .exec();

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
