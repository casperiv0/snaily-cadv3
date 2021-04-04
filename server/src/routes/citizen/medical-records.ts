import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
const router: Router = Router();

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const medicalRecords = await processQuery(
    "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
    [id, req.userId],
  );

  return res.json({ medicalRecords, status: "success" });
});

router.post("/:citizenId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId } = req.params;
  const { type, shortInfo } = req.body;

  if (type && shortInfo) {
    const id = uuidv4();
    const citizen = await processQuery(
      "SELECT `full_name` FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
      [citizenId, req.userId],
    );

    if (!citizen[0]) {
      return res.json({
        error: "Citizen was not found",
        status: "error",
      });
    }

    await processQuery(
      "INSERT INTO `medical_records` (`id`, `type`, `short_info`, `name`, `citizen_id`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)",
      [id, type, shortInfo, citizen[0]?.full_name, citizenId, req.userId],
    );

    const updated = await processQuery(
      "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
      [citizenId, req.userId],
    );
    return res.json({ status: "success", records: updated });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.delete("/:citizenId/:recordId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId, recordId } = req.params;

  await processQuery("DELETE FROM `medical_records` WHERE `id` = ? AND `citizen_id` = ?", [
    recordId,
    citizenId,
  ]);

  const medicalRecords = await processQuery(
    "SELECT * FROM `medical_records` WHERE `citizen_id` = ? AND `user_id` = ?",
    [citizenId, req.userId],
  );

  return res.json({ medicalRecords, status: "success" });
});

export default router;
