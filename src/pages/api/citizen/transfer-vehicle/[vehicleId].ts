import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { Vehicle } from "types/Vehicle";
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
      const { plate, ownerId } = req.body;

      if (!plate || !ownerId) {
        return res.status(400).json({
          error: formatRequired(["plate", "ownerId"], req.body),
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>(
        "SELECT `full_name` FROM `citizens` WHERE `id` = ?",
        [ownerId],
      );
      const [vehicle] = await processQuery<Vehicle>(
        "SELECT `id` FROM `registered_cars` WHERE `id` = ?",
        [req.query.vehicleId],
      );

      if (!citizen) {
        return res.json({ error: "Citizen does not exist", status: "error" });
      }

      if (!vehicle) {
        return res.json({ error: "Vehicle does not exist", status: "error" });
      }

      await processQuery(
        "UPDATE `registered_cars` SET `plate` = ?, `citizen_id` = ?, `owner` = ? WHERE `id` = ?",
        [plate, ownerId, citizen.full_name, req.query.vehicleId],
      );

      return res.json({ status: "success" });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
