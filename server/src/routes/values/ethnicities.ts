import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import IRequest from "../../interfaces/IRequest";
const router: Router = Router();

router.get("/", useAuth, async (_req: IRequest, res: Response) => {
  const ethnicities = await processQuery("SELECT * FROM `ethnicities`");

  return res.json({ status: "success", ethnicities });
});

export default router;