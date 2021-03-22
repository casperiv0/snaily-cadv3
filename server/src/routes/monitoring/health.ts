import { Response, Router } from "express";
import { processQuery } from "../../lib/database";
import Logger from "../../lib/Logger";
import IRequest from "../../interfaces/IRequest";

const router: Router = Router();

router.get("/liveness", async (_: IRequest, res: Response) => {
  let code = 200;
  let status = "UP";

  try {
    await processQuery("SELECT 1");
  } catch (err) {
    code = 500;
    status = "DOWN";
    Logger.log("ERROR", `Liveness failed: ${err.message}`);
  }

  return res.status(code).json({ status });
});

export default router;
