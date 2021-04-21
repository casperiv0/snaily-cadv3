import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { formatRequired, getActiveOfficer } from "@lib/utils.server";

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
        const { name, status, reason } = req.body;
        const officer = await getActiveOfficer(req);

        if (!name || !status || !reason) {
          return res.status(400).json({
            error: formatRequired(["name", "status", "reason"], req.body),
            status: "error",
          });
        }

        const [citizen] = await processQuery<{ id: string }>(
          "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
          [name],
        );

        if (!citizen) {
          return res.json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const id = v4();
        await processQuery(
          "INSERT INTO `warrants` (`id`, `name`, `citizen_id`, `reason`, `status`, `officer_name`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            name,
            citizen.id,
            reason,
            status,
            `${officer?.officer_dept} - ${officer?.callsign} ${officer?.officer_name}`,
          ],
        );

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("create_warrant", e);

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
