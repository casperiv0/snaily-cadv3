import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
import { logger } from "lib/logger";
import { AnError } from "lib/consts";
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
    case "PUT": {
      try {
        const body = req.body as Partial<Citizen>;
        const { dmv, fire_license, pilot_license, ccw } = req.body;

        if (
          !body.dmv ||
          !body.fire_license ||
          !body.pilot_license ||
          !body.ccw ||
          !body.cdl_license
        ) {
          return res.status(400).json({
            error: formatRequired(
              ["dmv", "fire_licenses", "pilot_license", "ccw", "cdl_license"],
              req.body,
            ),
            status: "error",
          });
        }

        await global.connection
          .query<Citizen>()
          .update("citizens", {
            dmv,
            fire_license,
            pilot_license,
            ccw,
            cdl_license: body.cdl_license,
          })
          .where("id", `${req.query.id}`)
          .exec();

        const [updated] = await global.connection
          .query<Citizen>()
          .select("*")
          .from("citizens")
          .where("id", `${req.query.id}`)
          .exec();

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
