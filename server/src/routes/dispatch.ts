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

router.delete(
  "/calls/:id",
  useAuth,
  useDispatchAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `911calls` WHERE `id` = ?", [id]);

    const calls = await processQuery("SELECT * FROM `911calls`");

    return res.json({ status: "success", calls });
  }
);

router.put(
  "/calls/:id",
  useAuth,
  useDispatchAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { location, description, assigned_unit } = req.body;
    let status = "";

    if (assigned_unit) {
      status = "Assigned";
    } else {
      status = "Not Assigned";
    }

    await processQuery(
      "UPDATE `911calls` SET `location` = ?, `description` = ?, `assigned_unit` = ?, `status` = ? WHERE `id` = ?",
      [location, description, assigned_unit, status, id]
    );

    const calls = await processQuery("SELECT * FROM `911calls`");

    return res.json({ status: "success", calls });
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
