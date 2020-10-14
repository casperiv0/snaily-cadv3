import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";

const router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const logs = await processQuery(
    "SELECT * FROM `truck_logs` WHERE `linked_to` = ?",
    [req.user?.username]
  );

  return res.json({ status: "success", logs });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { name, date, co_driver, start_time, plate } = req.body;

  if (name && date && start_time && plate) {
    await processQuery(
      "INSERT INTO `truck_logs` (`name`, `timestamp`, `co_driver`, `start_time`, `plate`, `linked_to`) VALUES (?, ?, ?, ?, ?, ?)",
      [name, date, co_driver ?? "None", start_time, plate, req.user?.username]
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

  const log = await processQuery("SELECT * FROM `truck_logs` WHERE id = ?", [
    id,
  ]);

  if (log[0].linked_to !== req.user?.username) {
    return res.json({ error: "Forbidden", status: "error" });
  }

  await processQuery("DELETE * FROM `truck_logs` WHERE id = ?", [id]);
});

export default router;
