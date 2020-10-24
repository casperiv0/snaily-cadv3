import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
import { generateVinNumber } from "../../lib/functions";

const router: Router = Router();

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  const vehicles = await processQuery(
    "SELECT * FROM `registered_cars` WHERE `citizen_id` = ? AND `user_id` = ?",
    [id, req.user?.id]
  );

  return res.json({ vehicles, status: "success" });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { plate, status, color, vehicle, citizenId } = req.body;

  if (plate && status && color && vehicle && citizenId) {
    const citizen = await processQuery(
      "SELECT `full_name` FROM `citizens` WHERE `id` = ?",
      [citizenId]
    );

    const existingPlate = await processQuery(
      "SELECT `plate` from `registered_cars` WHERE `plate` = ?",
      [plate]
    );

    if (existingPlate[0]) {
      return res.json({
        error: "Plate is already in use",
        status: "error",
      });
    }

    if (!citizen[0]) {
      return res.json({
        error: "Citizen does not exist",
        status: "error",
      });
    }

    const id = uuidv4();
    const vin = generateVinNumber();

    await processQuery(
      "INSERT INTO `registered_cars` (`id`, `owner`, `citizen_id`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`, `user_id`, `company`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        citizen[0].full_name,
        citizenId,
        vehicle,
        vin,
        status,
        plate,
        color,
        req.user?.id,
        "",
      ]
    );

    return res.json({ status: "success", citizenId });
  } else {
    return res.json({ status: "error", error: "Please fill in all fields" });
  }
});

router.delete(
  "/:citizenId/:vehicleId",
  useAuth,
  async (req: IRequest, res: Response) => {
    const { citizenId, vehicleId } = req.params;

    await processQuery("DELETE FROM `registered_cars` WHERE `id` = ?", [
      vehicleId,
    ]);

    const vehicles = await processQuery(
      "SELECT * FROM `registered_cars` WHERE `citizen_id` = ? AND `user_id` = ?",
      [citizenId, req.user?.id]
    );

    return res.json({
      status: "success",
      vehicles,
    });
  }
);

export default router;
