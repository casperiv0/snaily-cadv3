import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { formatRequired } from "@lib/utils.server";

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
    await usePermission(req, ["leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "POST": {
      try {
        const { name, officer_name, violations, postal, notes = "" } = req.body;

        if (!name || !violations || !postal || !officer_name) {
          return res.status(400).json({
            error: formatRequired(["name", "officer_name", "violations", "postal"], req.body),
            status: "error",
          });
        }

        const id = v4();
        const [citizen] = await processQuery<{ id: string }>(
          "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
          [name],
        );

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        await processQuery(
          "INSERT INTO `leo_tickets` (`id`, `name`, `citizen_id`, `violations`, `officer_name`, `date`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, name, citizen.id, violations, officer_name, Date.now(), notes, postal],
        );

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("create_ticket", e);

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
