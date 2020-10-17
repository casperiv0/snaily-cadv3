import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";

const router: Router = Router();

router.get("/911-calls", useAuth, async (req: IRequest, res: Response) => {
  const calls = await processQuery("SELECT * FROM `911calls`");

  return res.json({ calls, status: "success" });
});

export default router;
