import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
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
    await usePermission(req, ["leo"]);
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
          parse(`${req.headers["session"]}`)?.["active-officer"] ||
          parse(`${req.headers["cookie"]}`)?.["active-officer"];
        console.log(id);

        const [officer] = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `user_id` = ? AND `id` = ?",
          [req.userId, id],
        );

        return res.json({ officer, status: "success" });
      } catch (e) {
        logger.error("get_active_officer", e);

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
