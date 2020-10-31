import IRequest from "../../interfaces/IRequest";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Response, Router } from "express";
import { useAuth, useValidPath } from "../../hooks";
import { processQuery } from "../../lib/database";
import { RanksArr } from "../../lib/constants";

const router: Router = Router();

router.get(
  "/:path",
  useAuth,
  useValidPath,
  async (req: IRequest, res: Response) => {
    const parsedPath = req.parsedPath;

    const values = await processQuery(`SELECT * FROM \`${parsedPath}\``);

    return res.json({ values, status: "success" });
  }
);

router.get(
  "/:path/:id",
  useAuth,
  useAdminAuth,
  useValidPath,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const parsedPath = req.parsedPath;

    const value = await processQuery(
      `SELECT * FROM \`${parsedPath}\` WHERE \`id\` = ?`,
      [id]
    );

    return res.json({ status: "success", value: value[0] });
  }
);

router.post(
  "/:path",
  useAuth,
  useAdminAuth,
  useValidPath,
  async (req: IRequest, res: Response) => {
    const { name } = req.body;
    const parsedPath = req.parsedPath;
    const id = uuidv4();

    if (name) {
      await processQuery(
        `INSERT INTO \`${parsedPath}\` (\`id\`, \`name\`, \`defaults\`) VALUES (?, ?, ?)`,
        [id, name, "0"]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all all fields",
        status: "error",
      });
    }
  }
);

router.put(
  "/:path/:id",
  useAuth,
  useAdminAuth,
  useValidPath,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const parsedPath = req.parsedPath;

    if (name) {
      await processQuery(
        `UPDATE \`${parsedPath}\` SET \`name\` = ? WHERE \`id\` = ?`,
        [name, id]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({ error: "Please fill in all fields", status: "error" });
    }
  }
);

router.delete(
  "/:path/:id",
  useAuth,
  useAdminAuth,
  useValidPath,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const parsedPath = req.parsedPath;

    await processQuery(`DELETE FROM \`${parsedPath}\` WHERE \`id\` = ?`, [id]);

    const updated = await processQuery(`SELECT * FROM \`${parsedPath}\``);

    return res.json({ status: "success", values: updated });
  }
);

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

export { useAdminAuth };
export default router;
