import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
// import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
const router: Router = Router();

router.get(
  "/active-units",
  useAuth,
  useDispatchAuth,
  async (_req: IRequest, res: Response) => {
    const activeOfficers = await processQuery(
      "SELECT * FROM `officers` WHERE `status` = ?",
      ["on-duty"]
    );
    const activeEmsFd = await processQuery(
      "SELECT * FROM `ems-fd` WHERE `status` = ?",
      ["on-duty"]
    );

    return res.json({
      officers: activeOfficers,
      ems_fd: activeEmsFd,
      status: "success",
    });
  }
);

async function useDispatchAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await processQuery(
    "SELECT `dispatch` from `users` WHERE `id` = ?",
    [req.user?.id]
  );

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (user[0].dispatch !== "1") {
    res.json({
      error: "Forbidden",
      status: "error",
    });
    return;
  }

  next();
}

export default router;
