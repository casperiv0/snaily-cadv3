import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { formatRequired } from "lib/utils.server";
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
    await usePermission(req, ["dispatch", "owner", "admin"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const { aop } = req.body;

        if (!aop) {
          return res.status(400).json({
            error: formatRequired(["aop"], req.body),
            status: "error",
          });
        }

        await processQuery("UPDATE `cad_info` SET `AOP` = ?", [aop]);

        return res.json({
          status: "success",
          aop,
        });
      } catch (e) {
        logger.error("update_aop", e);

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
