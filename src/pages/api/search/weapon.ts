import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
import { usePermission } from "hooks/usePermission";
import { Weapon } from "types/Weapon";

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
        const { serialNumber } = req.body;

        if (!serialNumber) {
          return res.status(400).json({
            error: formatRequired(["serialNumber"], req.body),
            status: "error",
          });
        }

        const [weapon] = await global.connection
          .query<Weapon>()
          .select("*")
          .from("registered_weapons")
          .where("serial_number", serialNumber)
          .exec();

        return res.json({ weapon: weapon ?? {}, status: "success" });
      } catch (e) {
        logger.error("weapon_search", e);

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
