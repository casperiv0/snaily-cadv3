import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { AnError } from "@lib/consts";
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
    case "POST": {
      try {
        const { warrants, arrest_reports, tickets } = req.body;

        const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
          req.query.citizenId,
        ]);

        if (!citizen) {
          return res.json({
            error: "That citizen was not found",
            status: "error",
          });
        }

        await processQuery(
          "INSERT INTO `court_requests` (`id`, `warrants`, `arrest_reports`, `tickets`, `citizen_id`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            v4(),
            JSON.stringify(warrants),
            JSON.stringify(arrest_reports),
            JSON.stringify(tickets),
            req.query.citizenId,
            req.userId,
          ],
        );

        return res.json({
          status: "success",
        });
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
