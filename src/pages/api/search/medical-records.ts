import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { formatRequired } from "lib/utils.server";
import { Citizen } from "types/Citizen";

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
    await usePermission(req, ["ems_fd"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "POST": {
      try {
        const { name } = req.body;

        if (!name) {
          return res.status(400).json({
            error: formatRequired(["name"], req.body),
            status: "error",
          });
        }

        const [citizen] = await global.connection
          .query<Citizen>()
          .select(["dead", "dead_on"])
          .from("citizens")
          .where("full_name", name)
          .exec();

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const medicalRecords = await global.connection
          .query()
          .select("*")
          .from("medical_records")
          .where("name", name)
          .exec();

        if (medicalRecords.length <= 0) {
          return res.status(400).json({
            status: "error",
            error: "Citizen doesn't have any medical-records",
          });
        }

        return res.json({ status: "success", medicalRecords, citizen });
      } catch (e) {
        logger.error("search_medical_records", e);
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
