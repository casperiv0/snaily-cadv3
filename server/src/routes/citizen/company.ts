import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
const router: Router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const companies = await processQuery("SELECT `id`, `name` FROM `businesses`");
  const citizens = await processQuery(
    "SELECT * FROM `citizens` WHERE `user_id` = ?",
    [req.user?.id]
  );

  return res.json({ citizens, companies, status: "success" });
});

export default router;
