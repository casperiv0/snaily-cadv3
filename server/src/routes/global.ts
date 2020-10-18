import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";

const router: Router = Router();

router.get("/911-calls", useAuth, async (req: IRequest, res: Response) => {
  const calls = await processQuery("SELECT * FROM `911calls`");

  return res.json({ calls, status: "success" });
});

router.post("/cad-info", useAuth, async (req: IRequest, res: Response) => {
  const cadInfo = await processQuery("SELECT * FROM `cad_info`");

  return res.json({ cadInfo: cadInfo[0], status: "success" });
});

export default router;
