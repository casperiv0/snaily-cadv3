import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
import { generateString } from "../../lib/functions";

const router: Router = Router();

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const weapons = await processQuery("SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?", [
    id,
  ]);

  return res.json({ status: "success", weapons });
});

router.post("/", useAuth, async (req: IRequest, res: Response) => {
  const { weapon, citizenId, status, serial_number } = req.body;
  const citizen = await processQuery("SELECT `full_name` FROM `citizens` WHERE `id` = ?", [
    citizenId,
  ]);

  if (weapon && citizenId && status) {
    const id = uuidv4();
    const serial = serial_number ? serial_number : generateString(10);

    await processQuery(
      "INSERT INTO `registered_weapons` (`id`, `owner`, `citizen_id`, `weapon`, `serial_number`, `status`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, citizen[0].full_name, citizenId, weapon, serial, status, req.user?.id],
    );

    return res.json({ status: "success", citizenId });
  } else {
    return res.json({ status: "error", error: "Please fill in all fields" });
  }
});

router.delete("/:citizenId/:weaponId", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId, weaponId } = req.params;

  await processQuery("DELETE FROM `registered_weapons` WHERE `id` = ? AND `citizen_id` = ?", [
    weaponId,
    citizenId,
  ]);

  const weapons = await processQuery("SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?", [
    citizenId,
  ]);

  return res.json({ status: "success", weapons });
});

export default router;
