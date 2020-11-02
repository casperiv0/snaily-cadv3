import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
// import { v4 } from "uuid";
import { useAdminAuth } from "./values";
const router: Router = Router();

/* Cad settings */
router.put("/cad-settings", useAuth, async (req: IRequest, res: Response) => {
  const user = await processQuery("SELECT `rank` from `users` WHERE `id` = ?", [
    req.user?.id,
  ]);

  if (user[0].rank !== "owner") {
    return res.json({ error: "Forbidden", status: "error" }).status(403);
  }

  const {
    cad_name,
    aop,
    tow_whitelisted,
    whitelisted,
    company_whitelisted,
  } = req.body;

  if (
    cad_name &&
    aop &&
    tow_whitelisted &&
    whitelisted &&
    company_whitelisted
  ) {
    await processQuery(
      "UPDATE `cad_info` SET `cad_name` = ?, `AOP` = ?, `tow_whitelisted` = ?, `whitelisted` = ?, `company_whitelisted` = ?",
      [cad_name, aop, tow_whitelisted, whitelisted, company_whitelisted]
    );

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

/* members */
router.get(
  "/members",
  useAuth,
  useAdminAuth,
  async (_req: IRequest, res: Response) => {
    const members = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status`  FROM `users`"
    );

    return res.json({ status: "success", members });
  }
);

router.get(
  "/members/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const member = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status` FROM `users` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", member: member[0] });
  }
);

router.put(
  "/members/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { rank, leo, dispatch, emsFd, tow } = req.body;

    if (rank && leo && dispatch && emsFd && tow) {
      await processQuery(
        "UPDATE `users` SET `rank` = ?, `leo` = ?, `dispatch` = ?, `ems_fd` = ?, `tow` = ? WHERE `id` = ?",
        [rank, leo, dispatch, emsFd, tow, id]
      );

      const updated = await processQuery(
        "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status` FROM `users` WHERE `id` = ?",
        [id]
      );

      return res.json({ status: "success", member: updated[0] });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  }
);

router.put(
  "/members/:path/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { path, id } = req.params;
    const { ban_reason } = req.body;

    switch (path) {
      case "ban": {
        if (ban_reason) {
          await processQuery(
            "UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?",
            ["1", ban_reason, id]
          );
        } else {
          return res.json({ error: "Please include 'ban_reason'" });
        }
        break;
      }
      case "unban": {
        await processQuery(
          "UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?",
          ["0", "", id]
        );
        break;
      }
      case "accept": {
        await processQuery(
          "UPDATE `users` SET `whitelist_status` = ? WHERE `id` = ?",
          ["accepted", id]
        );
        break;
      }
      case "decline": {
        await processQuery("DELETE FROM `users` WHERE `id` = ?", [id]);
        break;
      }
      default: {
        return res.json({ error: "Invalid path", status: "error" });
      }
    }

    const members = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status`  FROM `users`"
    );

    const updated = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `dispatch_status` FROM `users` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", member: updated[0], members });
  }
);

/* citizens */
router.get(
  "/citizens",
  useAuth,
  useAdminAuth,
  async (_req: IRequest, res: Response) => {
    const citizens = await processQuery("SELECT * FROM `citizens`");

    return res.json({ citizens, status: "success" });
  }
);

router.delete(
  "/citizens/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [id]);

    const citizens = await processQuery("SELECT * FROM `citizens`");

    return res.json({ citizens, status: "success" });
  }
);

/* companies */
router.get("/companies", useAuth, async (_req: IRequest, res: Response) => {
  const companies = await processQuery("SELECT * FROM `businesses`");

  return res.json({ companies, status: "success" });
});

router.delete(
  "/companies/:id",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    const employees = await processQuery(
      "SELECT * FROM `citizens` WHERE `business_id` = ?",
      [id]
    );

    employees?.forEach(async (em: any) => {
      await processQuery(
        "UPDATE `citizens` SET `business_id` = ?, `business` = ?, `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ? WHERE `id` = ?",
        ["", "none", "", "1", "1", "", em.id]
      );
    });

    await processQuery("DELETE FROM `businesses` WHERE `id` = ?", [id]);

    const companies = await processQuery("SELECT * FROM `businesses`");

    return res.json({ companies, status: "success" });
  }
);

export default router;
