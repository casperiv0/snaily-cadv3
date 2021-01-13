import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import IRequest from "../interfaces/IRequest";
import { useAuth } from "../hooks";
import { RanksArr } from "../lib/constants";
import { v4 } from "uuid";

const router: Router = Router();

router.get("/911-calls", async (req: IRequest, res: Response) => {
  const calls = await processQuery("SELECT * FROM `911calls`");

  return res.json({ calls, status: "success" });
});

router.post("/911-calls", async (req: IRequest, res: Response) => {
	const id = v4();
	const { location, description, caller } = req.body
	await processQuery(
        "INSERT INTO `911calls` (`id`, `description`, `name`, `location`, `status`, `assigned_unit`) VALUES (?, ?, ?, ?, ?, ?)",
        [id, description, caller, location, "Not Assigned", ""]
      );

	return res.json({ status: "success" });
});

router.post("/cad-info", useAuth, async (req: IRequest, res: Response) => {
  const cadInfo = await processQuery("SELECT * FROM `cad_info`");

  return res.json({ cadInfo: cadInfo[0], status: "success" });
});

router.post(
  "/update-aop",
  useAuth,
  adminOrDispatchAuth,
  async (req: IRequest, res: Response) => {
    const { aop } = req.body;

    await processQuery("UPDATE `cad_info` SET `aop` = ?", [aop]);

    return res.json({ status: "success" });
  }
);

export async function adminOrDispatchAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user: {
    dispatch: string;
    rank: string;
  }[] = await processQuery(
    "SELECT `dispatch`, `rank` from `users` WHERE `id` = ?",
    [req.user?.id]
  );

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (user[0].dispatch !== "1" || !RanksArr.includes(user[0].rank)) {
    res.json({
      error: "Forbidden",
      status: "error",
    });
    return;
  }

  next();
}

export default router;
