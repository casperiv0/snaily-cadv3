import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
// import { v4 } from "uuid";
import { useAdminAuth } from "./values";
const router: Router = Router();

router.get(
  "/citizens",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const citizens = await processQuery("SELECT * FROM `citizens`");

    return res.json({ citizens, status: "success" });
  }
);

router.get(
  "/companies",
  useAuth,
  useAdminAuth,
  async (_req: IRequest, res: Response) => {
    const companies = await processQuery("SELECT * FROM `businesses`");

    return res.json({ companies, status: "success" });
  }
);

router.delete(
  "/companies/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `businesses` WHERE `id` = ?", [id]);

    const companies = await processQuery("SELECT * FROM `businesses`");

    return res.json({ companies, status: "success" });
  }
);

export default router;
