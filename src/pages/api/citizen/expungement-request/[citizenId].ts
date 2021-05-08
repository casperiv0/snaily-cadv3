import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
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

        const [citizen] = await global.connection
          .query<Citizen>()
          .select("*")
          .from("citizens")
          .where("id", `${req.query.citizenId}`)
          .exec();

        if (!citizen) {
          return res.status(404).json({
            error: "That citizen was not found",
            status: "error",
          });
        }

        await global.connection
          .query()
          .insert("court_requests", {
            id: v4(),
            warrants: JSON.stringify(warrants),
            arrest_reports: JSON.stringify(arrest_reports),
            tickets: JSON.stringify(tickets),
            citizen_id: req.query.citizenId,
            user_id: req.userId,
          })
          .exec();

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
