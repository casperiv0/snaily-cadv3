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

router.get("/i/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  const vehicle = await processQuery(
    "SELECT * FROM `registered_cars` WHERE `id` = ? AND `user_id` = ?",
    [id, req.user?.id]
  );

  return res.json({ vehicle: vehicle[0], status: "success" });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { plate, status, color, vehicle, citizenId, businessId } = req.body;

  if (plate && status && color && vehicle && citizenId) {
    const parsedPlate = plate.replace(/[oO]/g, "0");

    const citizen = await processQuery(
      "SELECT `full_name`, `business_id` FROM `citizens` WHERE `id` = ?",
      [citizenId]
    );

    const existingPlate = await processQuery(
      "SELECT `plate` from `registered_cars` WHERE `plate` = ?",
      [parsedPlate]
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

    if (businessId?.trim() !== "") {
      const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [businessId]);

      if (!company[0]) {
        return res.json({
          error: "That company was not found",
          status: "error",
        });
      }

      if (citizen[0].business_id !== company[0].id) {
        return res.json({
          error: "You are not working at that company!",
          status: "error",
        });
      }

      if (citizen[0].vehicle_reg === "0") {
        return res.json({
          error: "You are not allowed to register vehicles for this company",
          status: "error",
        });
      }
    }

    const id = uuidv4();
    const vin = generateVinNumber();

    await processQuery(
      "INSERT INTO `registered_cars` (`id`, `owner`, `citizen_id`, `vehicle`, `vin_number`, `in_status`, `plate`, `color`, `user_id`, `business_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        citizen[0].full_name,
        citizenId,
        vehicle,
        vin,
        status,
        parsedPlate,
        color,
        req.user?.id,
        businessId,
      ]
    );

    return res.json({ status: "success", citizenId });
  } else {
    return res.json({ status: "error", error: "Please fill in all fields" });
  }
});

router.post("/transfer/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { plate, ownerId } = req.body;

  if (plate && ownerId) {
    const citizen = await processQuery("SELECT `full_name` FROM `citizens` WHERE `id` = ?", [
      ownerId,
    ]);
    const vehicle = await processQuery("SELECT `id` FROM `registered_cars` WHERE `id` = ?", [id]);

    if (!citizen[0]) {
      return res.json({ error: "Citizen does not exist", status: "error" });
    }

    if (!vehicle[0]) {
      return res.json({ error: "Vehicle does not exist", status: "error" });
    }

    await processQuery(
      "UPDATE `registered_cars` SET `plate` = ?, `citizen_id` = ?, `owner` = ? WHERE `id` = ?",
      [plate, ownerId, citizen[0].full_name, id]
    );

    return res.json({ status: "success" });
  } else {
    return res.json({ status: "error", error: "Please fill in all fields" });
  }
});

router.put("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { color, status } = req.body;

  if (color && status) {
    await processQuery(
      "UPDATE `registered_cars` SET `color` = ?, `in_status` = ? WHERE `id` = ? AND `user_id` = ?",
      [color, status, id, req.user?.id]
    );

    return res.json({ status: "success" });
  } else {
    return res.json({ status: "error", error: "Please fill in all fields" });
  }
});

router.put("/report-stolen/:vehicleId", useAuth, async (req: IRequest, res: Response) => {
  const { vehicleId } = req.params;

  await processQuery("UPDATE `registered_cars` SET `in_status` = ? WHERE `id` = ?", [
    "Reported stolen",
    vehicleId,
  ]);

  return res.json({
    status: "success",
  });
});

router.delete("/:citizenId/:vehicleId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId, vehicleId } = req.params;

  await processQuery("DELETE FROM `registered_cars` WHERE `id` = ?", [vehicleId]);

  const vehicles = await processQuery(
    "SELECT * FROM `registered_cars` WHERE `citizen_id` = ? AND `user_id` = ?",
    [citizenId, req.user?.id]
  );

  return res.json({
    status: "success",
    vehicles,
  });
});

export default router;
