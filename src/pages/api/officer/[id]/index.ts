import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { Officer } from "types/Officer";
import { useCookie } from "hooks/useCookie";
import { parseOfficers } from "..";

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
    await usePermission(req, ["dispatch", "leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "DELETE": {
      try {
        const [officer] = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `id` = ? AND `user_id` = ?",
          [req.query.id, req.userId],
        );

        if (!officer) {
          return res.status(404).json({
            error: "Officer was not found",
            status: "error",
          });
        }

        await processQuery("DELETE FROM `officers` WHERE `id` = ? AND `user_id` = ?", [
          req.query.id,
          req.userId,
        ]);
        useCookie(res, "", "active-officer", new Date(Date.now()));

        const officers = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `user_id` = ?",
          [req.userId],
        );

        return res.json({ status: "success", officers: await parseOfficers(officers) });
      } catch (e) {
        logger.error("delete_officer", e);

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
