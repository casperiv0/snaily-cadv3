import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { logger } from "@lib/logger";
import { AnError } from "@lib/consts";
import { Citizen } from "types/Citizen";
import { MedicalRecord } from "types/MedicalRecord";

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
      const medicalRecords = await global.connection
        .query<MedicalRecord>()
        .select("*")
        .from("medical_records")
        .where("citizen_id", `${req.query.id}`)
        .and("user_id", req.userId)
        .exec();

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
      const [citizen] = await global.connection
        .query<Citizen>()
        .select("full_name")
        .from("citizens")
        .where("id", `${req.query.id}`)
        .and("user_id", req.userId)
        .exec();

      if (!citizen) {
        return res.status(404).json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await global.connection
        .query<MedicalRecord>()
        .insert("medical_records", {
          id,
          type,
          short_info: shortInfo,
          name: citizen.full_name,
          citizen_id: `${req.query.id}`,
          user_id: req.userId,
        })
        .exec();

      const updated = await global.connection
        .query<MedicalRecord>()
        .select("*")
        .from("medical_records")
        .where("citizen_id", `${req.query.id}`)
        .and("user_id", req.userId)
        .exec();

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

        await global.connection
          .query<MedicalRecord>()
          .delete("medical_records")
          .where("id", `${req.query.recordId}`)
          .and("citizen_id", `${req.query.id}`)
          .exec();

        const medicalRecords = await global.connection
          .query<MedicalRecord>()
          .select("*")
          .from("medical_records")
          .where("citizen_id", `${req.query.id}`)
          .and("user_id", req.userId)
          .exec();

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
