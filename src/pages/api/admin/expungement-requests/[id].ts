import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { SelectValue } from "@components/Select/Select";
import { createNotification } from "@lib/utils.server";

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
    case "PUT": {
      try {
        const [request] = await processQuery<any>("SELECT * FROM `court_requests` WHERE `id` = ?", [
          req.query.id,
        ]);

        if (!request) {
          return res.status(404).json({
            error: "request was not found",
            status: "error",
          });
        }

        switch (req.query.type) {
          case "accept": {
            // value to remove from the citizen
            const { warrants, arrestReports, tickets } = req.body;

            warrants.forEach(async (warrant: SelectValue) => {
              await processQuery("DELETE FROM `warrants` WHERE `id` = ?", [warrant.value]);
            });
            arrestReports.forEach(async (arr: SelectValue) => {
              await processQuery("DELETE FROM `arrest_reports` WHERE `id` = ?", [arr.value]);
            });
            tickets.forEach(async (ticket: SelectValue) => {
              await processQuery("DELETE FROM `leo_tickets` WHERE `id` = ?", [ticket.value]);
            });

            await processQuery("DELETE FROM `court_requests` WHERE `id` = ?", [req.query.id]);
            await createNotification(
              "Expungement request accepted",
              `Your expungement was accepted for citizen with id: ${request.citizen_id}`,
              "/court",
              request.user_id,
            );

            break;
          }
          case "decline": {
            await processQuery("DELETE FROM `court_requests` WHERE `id` = ?", [req.query.id]);
            await createNotification(
              "Expungement request declined",
              `Your expungement was declined for citizen with id: ${request.citizen_id}`,
              "/court",
              request.user_id,
            );

            break;
          }
          default: {
            return res.status(400).json({
              error: "invalid type",
              status: "error",
            });
          }
        }

        const updated = await processQuery("SELECT * FROM `court_requests`");
        return res.json({
          status: "success",
          requests: updated.map((request: any) => {
            request.warrants = JSON.parse(request.warrants);
            request.arrestReports = JSON.parse(request.arrest_reports);
            request.tickets = JSON.parse(request.tickets);
            return request;
          }),
        });
      } catch (e) {
        logger.error("update_expungement_request", e);

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
