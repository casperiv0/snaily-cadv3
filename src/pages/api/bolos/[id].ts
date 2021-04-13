import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { usePermission } from "@hooks/usePermission";

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
    case "DELETE": {
      try {
        await processQuery("DELETE FROM `bolos` WHERE `id` = ?", [req.query.id]);

        const bolos = await processQuery("SELECT * FROM `bolos`");
        return res.json({ bolos, status: "success" });
      } catch (e) {
        logger.error("delete_bolo", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const { type, description, name, color, plate } = req.body;

        if (!description) {
          return res.status(400).json({
            error: formatRequired(["description"], req.body),
            status: "error",
          });
        }

        const [bolo] = await processQuery<{ id: string }>(
          "SELECT `id` FROM `bolos` WHERE `id` = ?",
          [req.query.id],
        );

        if (!bolo) {
          return res.status(400).json({
            error: "bolo was not found",
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `bolos` SET `type` = ?, `description` = ?, `name` = ?, `color` = ?, `plate` = ? WHERE `id` = ?",
          [type, description, name, color, plate, bolo.id],
        );

        const bolos = await processQuery("SELECT * FROM `bolos`");
        return res.json({ status: "success", bolos });
      } catch (e) {
        logger.error("update_bolo", e);

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
