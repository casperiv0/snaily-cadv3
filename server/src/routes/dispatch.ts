import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import { v4 } from "uuid";
import { mapCalls } from "./global";
import usePermission from "../hooks/usePermission";
import { io } from "../server";
import Call from "../interfaces/Call";
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
  const { location, caller } = req.body;
  const id = v4();

  if (location && caller) {
    const description = req.body.description || "No description provided";
    await processQuery(
      "INSERT INTO `911calls` (`id`, `description`, `name`, `location`, `status`, `assigned_unit`, `hidden`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, description, caller, location, "Not Assigned", "[]", "1"],
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
  const { location, assigned_unit, pos, hidden } = req.body;
  const description = req.body.description || "No description provided";

  let status = "";

  if (location) {
    const call = await processQuery<Call[]>("SELECT `pos` FROM `911calls` WHERE `id` = ?", [id]);

    let position = {};

    try {
      position = JSON.parse(`${call[0]?.pos}`);
    } catch {
      position = { x: null, y: null, z: null };
    }

    if (assigned_unit.length > 0) {
      status = "Assigned";

      assigned_unit?.forEach(async (unit: { value: string; label: string }) => {
        await processQuery("UPDATE `officers` SET `status2` = ? WHERE `id` = ?", ["10-97", unit.value]);
      });
    } else {
      status = "Not Assigned";
    }

    if (pos) {
      position = pos;
    }

    io.sockets.emit("UPDATE_ACTIVE_UNITS");
    await processQuery(
      "UPDATE `911calls` SET `location` = ?, `description` = ?, `assigned_unit` = ?, `status` = ?, `pos` = ?, `hidden` = ? WHERE `id` = ?",
      [location, description, JSON.stringify(assigned_unit), status, JSON.stringify(position), hidden, id],
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
