import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { Officer } from "types/Officer";
import { parse } from "cookie";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  try {
    await usePermission(req, ["ems_fd"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const id =
          parse(`${req.headers["session"]}`)?.["active-deputy"] ||
          parse(`${req.headers["cookie"]}`)?.["active-deputy"];

        const [deputy] = await processQuery<Officer>(
          "SELECT * FROM `ems-fd` WHERE `user_id` = ? AND `id` = ?",
          [req.userId, id],
        );

        return res.json({ deputy, status: "success" });
      } catch (e) {
        logger.error("get_active_deputy", e);

        return res.status(500).json(AnError);
      }
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
