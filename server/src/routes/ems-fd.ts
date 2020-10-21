import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
const router: Router = Router();

router.get(
  "/my-deputies",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const deputies = await processQuery(
      "SELECT * FROM `ems-fd` WHERE `user_id` = ?",
      [req.user?.id]
    );

    return res.json({ deputies, status: "success" });
  }
);

router.post(
  "/my-deputies",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const { name } = req.body;
    const id = uuidv4();

    if (name) {
      await processQuery(
        "INSERT INTO `ems-fd` (`id`, `name`, `user_id`, `status`, `status2`) VALUES (?, ?, ?, ?, ?)",
        [id, name, req.user?.id, "off-duty", "--------"]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({ status: "error", error: "Please fill in all fields" });
    }
  }
);

router.delete(
  "/my-deputies/:id",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `ems-fd` WHERE `id` = ?", [id]);

    const deputies = await processQuery(
      "SELECT * FROM `ems-fd` WHERE `user_id` = ?",
      [req.user?.id]
    );

    return res.json({ status: "success", deputies });
  }
);

router.get(
  "/status/:id",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const deputy = await processQuery("SELECT * FROM `ems-fd` WHERE `id` = ?", [
      id,
    ]);

    return res.json({ status: "success", deputy: deputy[0] });
  }
);

router.put(
  "/status/:id",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { status, status2 } = req.body;
    await processQuery(
      "UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `id` = ?",
      [status, status2, id]
    );

    const updated = await processQuery(
      "SELECT * FROM `ems-fd` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", deputy: updated });
  }
);

router.get(
  "/medical-records/:name",
  useAuth,
  useEmsAuth,
  async (req: IRequest, res: Response) => {
    const { name } = req.params;

    const medicalRecords = await processQuery(
      "SELECT * FROM `medical_records` WHERE `name` = ?",
      [name]
    );

    return res.json({ status: "success", medicalRecords });
  }
);

async function useEmsAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await processQuery(
    "SELECT `ems_fd` from `users` WHERE `id` = ?",
    [req.user?.id]
  );

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (user[0].ems_fd !== "1") {
    res.json({
      error: "Forbidden",
      status: "error",
    });
    return;
  }

  next();
}

export default router;
