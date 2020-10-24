import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import IRequest from "../../interfaces/IRequest";
const router: Router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const vehicles = await processQuery("SELECT * FROM `vehicles`");

  return res.json({ vehicles, status: "success" });
});

export default router;
