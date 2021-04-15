import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { logger } from "@lib/logger";
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
    case "GET": {
      const medicalRecords = await processQuery(
        "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
        [req.query.id, req.userId],
      );

      return res.json({ medicalRecords, status: "success" });
    }
    case "POST": {
      const { type, shortInfo } = req.body;

      if (!type || !shortInfo) {
        return res.status(400).json({
          status: "error",
          error: formatRequired(["type", "shortInfo"], req.body),
        });
      }

      const id = v4();
      const [citizen] = await processQuery<Citizen>(
        "SELECT `full_name` FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
        [req.query.id, req.userId],
      );

      if (!citizen) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `medical_records` (`id`, `type`, `short_info`, `name`, `citizen_id`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)",
        [id, type, shortInfo, citizen?.full_name, req.query.id, req.userId],
      );

      const updated = await processQuery(
        "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
        [req.query.id, req.userId],
      );
      return res.json({ status: "success", medicalRecords: updated });
    }
    case "DELETE": {
      try {
        if (!req.query.recordId) {
          return res.status(400).json({
            error: "recordId is required",
            status: "error",
          });
        }

        await processQuery("DELETE FROM `medical_records` WHERE `id` = ? AND `citizen_id` = ?", [
          req.query.recordId,
          req.query.id,
        ]);

        const medicalRecords = await processQuery(
          "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
          [req.query.id, req.userId],
        );

        return res.json({ medicalRecords, status: "success" });
      } catch (e) {
        logger.error("update_medical_records", e);

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
