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

router.get(
  "/active-units",
  useAuth,
  usePermission(["dispatch"]),
  async (_req: IRequest, res: Response) => {
    const activeOfficers = await processQuery("SELECT * FROM `officers` WHERE `status` = ?", [
      "on-duty",
    ]);
    const activeEmsFd = await processQuery("SELECT * FROM `ems-fd` WHERE `status` = ?", [
      "on-duty",
    ]);

    return res.json({
      officers: activeOfficers,
      ems_fd: activeEmsFd,
      status: "success",
    });
  },
);

router.get(
  "/bolos",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (_req: IRequest, res: Response) => {
    const bolos = await processQuery("SELECT * FROM `bolos`");

    return res.json({ bolos, status: "success" });
  },
);

router.post(
  "/bolos",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
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
  },
);

router.put(
  "/bolos/:id",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { type, description, name, color, plate } = req.body;

    if (!description) {
      return res.json({
        error: "`description` is required.",
        status: "error",
      });
    }
    const bolo = await processQuery("SELECT `id` FROM `bolos` WHERE `id` = ?", [req.params.id]);

    if (!bolo[0]) {
      return res.json({
        error: "bolo was not found",
        status: "error",
      });
    }

    await processQuery(
      "UPDATE `bolos` SET `type` = ?, `description` = ?, `name` = ?, `color` = ?, `plate` = ? WHERE `id` = ?",
      [type, description, name, color, plate, bolo[0].id],
    );

    const bolos = await processQuery("SELECT * FROM `bolos`");

    return res.json({ status: "success", bolos });
  },
);

router.delete(
  "/bolos/:id",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `bolos` WHERE `id` = ?", [id]);

    const bolos = await processQuery("SELECT * FROM `bolos`");

    return res.json({ bolos, status: "success" });
  },
);

router.delete(
  "/calls/:id",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `911calls` WHERE `id` = ?", [id]);
    await processQuery("DELETE FROM `call_events` WHERE `call_id` = ?", [id]);

    const calls = await processQuery("SELECT * FROM `911calls`");
    const mappedCalls = mapCalls(calls);

    return res.json({ status: "success", calls: mappedCalls });
  },
);

router.put(
  "/calls/:id",
  useAuth,
  usePermission(["dispatch", "leo"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { location, assigned_unit, pos, hidden, type } = req.body;
    const description = req.body.description || "No description provided";

    let status = "";

    if (location) {
      const call = await processQuery<Call>("SELECT `pos` FROM `911calls` WHERE `id` = ?", [id]);

      let position = {};

      try {
        position = JSON.parse(`${call[0]?.pos}`);
      } catch {
        position = { x: null, y: null, z: null };
      }

      if (assigned_unit.length > 0) {
        status = "Assigned";

        assigned_unit?.forEach(async (unit: { value: string; label: string }) => {
          await processQuery("UPDATE `officers` SET `status2` = ? WHERE `id` = ?", [
            "10-97",
            unit.value,
          ]);
        });
      } else {
        status = "Not Assigned";
      }

      if (pos) {
        position = pos;
      }

      io.sockets.emit("UPDATE_ACTIVE_UNITS");
      await processQuery(
        "UPDATE `911calls` SET `location` = ?, `description` = ?, `assigned_unit` = ?, `status` = ?, `pos` = ?, `hidden` = ?, `type` = ? WHERE `id` = ?",
        [
          location,
          description,
          JSON.stringify(assigned_unit),
          status,
          JSON.stringify(position),
          hidden || "0",
          type,
          id,
        ],
      );

      const calls = await processQuery("SELECT * FROM `911calls`");
      const mappedCalls = mapCalls(calls);

      return res.json({ status: "success", calls: mappedCalls });
    } else {
      return res.json({ error: "Please fill in all fields", status: "error" });
    }
  },
);

router.post(
  "/event/:callId",
  useAuth,
  usePermission(["dispatch"]),
  async (req: IRequest, res: Response) => {
    const { callId } = req.params;
    const { text } = req.body;

    const call = await processQuery("SELECT * FROM `911calls` WHERE `id` = ?", [callId]);

    if (!call[0]) {
      return res.json({
        error: "That call was not found",
        status: "error",
      });
    }

    await processQuery(
      "INSERT INTO `call_events` (`id`, `call_id`, `text`, `date`) VALUES (?, ?, ?, ?)",
      [v4(), callId, text, Date.now()],
    );

    io.sockets.emit("UPDATE_911_CALLS");

    return res.json({
      status: "success",
    });
  },
);

router.post(
  "/search/address",
  useAuth,
  usePermission(["dispatch"]),
  async (req: IRequest, res: Response) => {
    const { address } = req.body;

    const results = await processQuery("SELECT * FROM `citizens` WHERE `address` LIKE ?", [
      `%${address}%`,
    ]);

    return res.json({ results, status: "success" });
  },
);

router.get(
  "/map/steam_ids",
  useAuth,
  usePermission(["dispatch"]),
  async (_req: IRequest, res: Response) => {
    const members = await processQuery("SELECT `steam_id`, `leo`, `ems_fd` FROM `users`");

    return res.json({ status: "success", members });
  },
);

export default router;
