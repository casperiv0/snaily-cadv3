import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { formatRequired, generateString } from "@lib/utils";
import { Citizen } from "types/Citizen";
import { IRequest } from "types/IRequest";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method, query } = req;

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
        const weapons = await processQuery(
          "SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?",
          [query.id],
        );

        return res.json({ status: "success", weapons });
      } catch (e) {
        logger.error("GET_WEAPONS_FOR_CITIZEN", e);

        return res.status(500).json(AnError);
      }
    }

    case "POST": {
      try {
        const { weapon, status, serial_number } = req.body;
        const citizenId = query.id;
        const id = v4();
        const serialNumber = serial_number ?? generateString(10);

        if (!weapon || !status) {
          return res.status(400).json({
            error: formatRequired(["weapon", "status"], req.body),
            status: "error",
          });
        }

        const [citizen] = await processQuery<Citizen>(
          "SELECT `full_name` FROM `citizens` WHERE `id` = ?",
          [citizenId],
        );

        await processQuery(
          "INSERT INTO `registered_weapons` (`id`, `owner`, `citizen_id`, `weapon`, `serial_number`, `status`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id, citizen.full_name, citizenId, weapon, serialNumber, status, req.userId],
        );

        const weapons = await processQuery(
          "SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?",
          [citizenId],
        );
        return res.json({ status: "success", citizenId, weapons });
      } catch (e) {
        logger.error("CREATE_WEAPON", e);

        return res.status(500).json(AnError);
      }
    }

    case "DELETE": {
      try {
        await processQuery("DELETE FROM `registered_weapons` WHERE `id` = ? AND `citizen_id` = ?", [
          query.weaponId,
          query.id,
        ]);

        const weapons = await processQuery(
          "SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?",
          [query.id],
        );
        return res.json({ status: "success", weapons });
      } catch (e) {
        logger.error("DELETE_WEAPON", e);

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
