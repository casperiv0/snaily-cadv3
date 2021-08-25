import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { usePermission } from "hooks/usePermission";

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
    await usePermission(req, ["admin", "owner", "moderator"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const requests = await processQuery("SELECT * FROM `court_requests`");

        const parsedRequests = async () => {
          const reqs: any[] = [];

          await Promise.all(
            requests.map(async (request: any) => {
              const [citizen] = await processQuery(
                "SELECT `full_name` FROM `citizens` WHERE `id` = ?",
                [request.citizen_id],
              );
              const [user] = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
                request.user_id,
              ]);

              request.user = user;
              request.citizen = citizen;

              request.warrants = JSON.parse(request.warrants);
              request.arrestReports = JSON.parse(request.arrest_reports);
              request.tickets = JSON.parse(request.tickets);

              reqs.push(request);
            }),
          );

          return reqs;
        };

        return res.json({
          status: "success",
          expungementRequests: await parsedRequests(),
        });
      } catch (e) {
        logger.error("get_expungement_requests", e);

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
