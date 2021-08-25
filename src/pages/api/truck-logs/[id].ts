import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { TruckLog } from "types/TruckLog";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        await global.connection
          .query<TruckLog>()
          .delete("truck_logs")
          .where("id", `${req.query.id}`)
          .and("user_id", req.userId)
          .exec();

        const logs = await global.connection
          .query<TruckLog>()
          .select("*")
          .from("truck_logs")
          .where("user_id", req.userId)
          .exec();

        return res.json({ status: "success", logs });
      } catch (e) {
        logger.error("cad-info", e);

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
