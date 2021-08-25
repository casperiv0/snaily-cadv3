import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { usePermission } from "hooks/usePermission";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  try {
    await usePermission(req, ["admin", "owner", "moderator"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [req.query.id]);

        const citizens = await processQuery("SELECT * FROM `citizens`");
        return res.json({ citizens, status: "success" });
      } catch (e) {
        logger.error("delete_citizen", e);

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
