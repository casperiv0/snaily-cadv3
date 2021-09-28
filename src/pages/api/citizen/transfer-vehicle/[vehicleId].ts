import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
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

      const [citizen] = await global.connection
        .query<Citizen>()
        .select("full_name")
        .from("citizens")
        .where("id", ownerId)
        .exec();

      const [vehicle] = await global.connection
        .query<Vehicle>()
        .select("id")
        .from("registered_cars")
        .where("id", `${req.query.vehicleId}`)
        .exec();

      if (!citizen) {
        return res.status(404).json({ error: "Citizen does not exist", status: "error" });
      }

      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle does not exist", status: "error" });
      }

      await global.connection
        .query<Vehicle>()
        .update("registered_cars", {
          plate,
          citizen_id: ownerId,
          owner: citizen.full_name,
        })
        .where("id", req.query.vehicleId.toString())
        .exec();

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
