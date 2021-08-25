import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
import { usePermission } from "hooks/usePermission";
import { Vehicle } from "types/Vehicle";

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
        const { plate } = req.body;

        if (!plate) {
          return res.status(400).json({
            error: formatRequired(["plate"], req.body),
            status: "error",
          });
        }

        const [result] = await global.connection
          .query<Vehicle>()
          .select("*")
          .from("registered_cars")
          .where("plate", plate)
          .or("vin_number", plate)
          .exec();

        return res.json({ vehicle: result ?? {}, status: "success" });
      } catch (e) {
        logger.error("search_plate", e);

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
