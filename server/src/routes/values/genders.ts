import { NextFunction, Response, Router } from "express";
import { processQuery } from "../../lib/database";
import { useAuth } from "../../hooks";
import { RanksArr } from "../../lib/constants";
import { v4 } from "uuid";
import IRequest from "../../interfaces/IRequest";
const router: Router = Router();

router.get("/", useAuth, async (_req: IRequest, res: Response) => {
  const genders = await processQuery("SELECT * FROM `genders`");

  return res.json({ status: "success", genders });
});

router.post("/", useAuth, useAdminAuth, async (req, res) => {
  const { name } = req.body;
  const id = v4();

  if (name) {
    await processQuery("INSERT INTO `genders` (`id`, `name`) VALUES (?, ?)", [
      id,
      name,
    ]);

    return res.json({ status: "success" });
  }
});

async function useAdminAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await processQuery("SELECT `rank` from `users` WHERE `id` = ?", [
    req.user?.id,
  ]);

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (!RanksArr.includes(user[0].rank)) {
    res.json({
      error: "Forbidden",
      status: "error",
    });
    return;
  }

  next();
}

export default router;
