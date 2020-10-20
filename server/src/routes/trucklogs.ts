import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";
import { v4 } from "uuid";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const logs = await processQuery(
    "SELECT * FROM `truck_logs` WHERE `user_id` = ?",
    [req.user?.id]
  );

  return res.json({ status: "success", logs });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { name, date, co_driver, start_time, plate } = req.body;
  const id = v4();

  if (name && date && start_time && plate) {
    await processQuery(
      "INSERT INTO `truck_logs` (`id`, `name`, `timestamp`, `co_driver`, `start_time`, `plate`, `linked_to`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, date, co_driver ?? "None", start_time, plate, req.user?.id]
    );

    return res.json({
      status: "success",
    });
  } else {
    return res.json({
      error: "Please fill in all required fields",
      status: "error",
    });
  }
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  const log = await processQuery("SELECT * FROM `truck_logs` WHERE `id` = ?", [
    id,
  ]);

  if (log[0].user_id !== req.user?.id) {
    return res.json({ error: "Forbidden", status: "error" });
  }

  await processQuery("DELETE * FROM `truck_logs` WHERE `id` = ?", [id]);

  const logs = await processQuery(
    "SELECT * FROM `truck_logs` WHERE `user_id` = ?",
    [req.user?.id]
  );

  return res.json({ status: "success", logs });
});

export default router;
