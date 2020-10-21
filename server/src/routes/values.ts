import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
import { RanksArr } from "../lib/constants";
const router: Router = Router();

/* genders */
router.get("/genders", useAuth, async (req: IRequest, res: Response) => {
  const genders = await processQuery("SELECT * FROM `genders`");

  return res.json({ status: "success", genders });
});

router.post(
  "/genders",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { name } = req.body;
    const id = uuidv4();

    if (name) {
      await processQuery("INSERT INTO `genders` (`id`, `name`) VALUES (?, ?)", [
        id,
        name,
      ]);

      return res.json({ status: "success" });
    }
  }
);

/* ethnicities */
router.get("/ethnicities", useAuth, async (req: IRequest, res: Response) => {
  const ethnicities = await processQuery("SELECT * FROM `ethnicities`");

  return res.json({ status: "success", ethnicities });
});

export async function useAdminAuth(
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
