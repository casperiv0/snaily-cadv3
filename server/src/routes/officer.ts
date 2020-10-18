import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";

const router: Router = Router();

router.get("/status/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const officer = await processQuery(
    "SELECT * FROM `officers` WHERE  `officers`.`id` = ?",
    [id]
  );

  return res.json({ officer: officer[0], status: "success" });
});

router.put("/status/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { status, status2 } = req.body;

  await processQuery(
    "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?",
    [status, status2, id]
  );

  const updatedOfficer = await processQuery(
    "SELECT * FROM `officers` WHERE `id` = ?",
    [id]
  );

  return res.json({ status: "success", officer: updatedOfficer });
});

export default router;
