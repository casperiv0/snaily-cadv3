import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import { v4 } from "uuid";
import { mapCalls } from "./global";
import usePermission from "../hooks/usePermission";
const router: Router = Router();

router.get("/active-units", useAuth, usePermission(["dispatch"]), async (_req: IRequest, res: Response) => {
  const activeOfficers = await processQuery("SELECT * FROM `officers` WHERE `status` = ?", ["on-duty"]);
  const activeEmsFd = await processQuery("SELECT * FROM `ems-fd` WHERE `status` = ?", ["on-duty"]);

  return res.json({
    officers: activeOfficers,
    ems_fd: activeEmsFd,
    status: "success",
  });
});

router.get("/bolos", useAuth, usePermission(["leo", "dispatch"]), async (_req: IRequest, res: Response) => {
  const bolos = await processQuery("SELECT * FROM `bolos`");

  return res.json({ bolos, status: "success" });
});

router.post("/bolos", useAuth, usePermission(["leo", "dispatch"]), async (req: IRequest, res: Response) => {
  const { type, description, name, color, plate } = req.body;

  if (description) {
    const id = v4();

    await processQuery(
      "INSERT INTO `bolos` (`id`, `type`, `description`, `name`, `color`, `plate`) VALUES (?, ?, ?, ?, ?, ?)",
      [id, type, description, name, color, plate],
    );

    const bolos = await processQuery("SELECT * FROM `bolos`");

    return res.json({ status: "success", bolos });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.delete("/bolos/:id", useAuth, usePermission(["leo", "dispatch"]), async (req: IRequest, res: Response) => {
  const { id } = req.params;

  await processQuery("DELETE FROM `bolos` WHERE `id` = ?", [id]);

  const bolos = await processQuery("SELECT * FROM `bolos`");

  return res.json({ bolos, status: "success" });
});

router.post("/calls", useAuth, usePermission(["leo", "dispatch"]), async (req: IRequest, res: Response) => {
  const { location, description, caller } = req.body;
  const id = v4();

  if (location && description && caller) {
    await processQuery(
      "INSERT INTO `911calls` (`id`, `description`, `name`, `location`, `status`, `assigned_unit`) VALUES (?, ?, ?, ?, ?, ?)",
      [id, description, caller, location, "Not Assigned", "[]"],
    );

    const calls = await processQuery("SELECT * FROM `911calls`");
    const mappedCalls = mapCalls(calls);

    return res.json({ status: "success", calls: mappedCalls });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.delete("/calls/:id", useAuth, usePermission(["leo", "dispatch"]), async (req: IRequest, res: Response) => {
  const { id } = req.params;

  await processQuery("DELETE FROM `911calls` WHERE `id` = ?", [id]);

  const calls = await processQuery("SELECT * FROM `911calls`");
  const mappedCalls = mapCalls(calls);

  return res.json({ status: "success", calls: mappedCalls });
});

router.put("/calls/:id", useAuth, usePermission(["dispatch"]), async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { location, description, assigned_unit } = req.body;
  let status = "";

  if (location && description && assigned_unit) {
    if (assigned_unit.length > 0) {
      status = "Assigned";
    } else {
      status = "Not Assigned";
    }

    await processQuery(
      "UPDATE `911calls` SET `location` = ?, `description` = ?, `assigned_unit` = ?, `status` = ? WHERE `id` = ?",
      [location, description, JSON.stringify(assigned_unit), status, id],
    );

    const calls = await processQuery("SELECT * FROM `911calls`");
    const mappedCalls = mapCalls(calls);

    return res.json({ status: "success", calls: mappedCalls });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/search/address", useAuth, usePermission(["dispatch"]), async (req: IRequest, res: Response) => {
  const { address } = req.body;

  const results = await processQuery("SELECT * FROM `citizens` WHERE `address` LIKE ?", [`%${address}%`]);

  return res.json({ results, status: "success" });
});

export default router;
