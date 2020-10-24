import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import IRequest from "../../interfaces/IRequest";
const router: Router = Router();

router.get("/", useAuth, async (_req: IRequest, res: Response) => {
  const weapons = await processQuery("SELECT * FROM `weapons`");

  return res.json({ status: "success", weapons });
});

export default router;
