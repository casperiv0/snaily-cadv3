import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { logger } from "@lib/logger";
import { AnError } from "@lib/consts";

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
    case "PUT": {
      try {
        const { dmv, fire_license, pilot_license, ccw } = req.body;

        if (!dmv || !fire_license || !pilot_license || !ccw) {
          return res.status(400).json({
            error: formatRequired(["dmv", "fire_licenses", "pilot_license", "ccw"], req.body),
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `citizens` SET `dmv` = ?, `fire_license` = ?, `pilot_license` = ?, `ccw` = ? WHERE `id` = ?",
          [dmv, fire_license, pilot_license, ccw, req.query.id],
        );

        const [updated] = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [
          req.query.id,
        ]);
        return res.json({ status: "success", citizen: updated });
      } catch (e) {
        logger.error("REGISTER_VEHICLE", e);

        return res.status(500).json({
          error: AnError,
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
