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

export default router;
