import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { useValidPath } from "@hooks/useValidPath";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  await useValidPath(req);

  if (req.method !== "GET") {
    try {
      await usePermission(req, ["admin", "owner", "moderator"]);
    } catch (e) {
      return res.status(e?.code ?? 400).json({
        status: "error",
        error: e,
      });
    }
  }

  switch (req.method) {
    case "GET": {
      try {
        const parsedPath = req.parsedPath;

        const values = await processQuery(`SELECT * FROM \`${parsedPath}\``);

        return res.json({ values, status: "success" });
      } catch (e) {
        logger.error("cad-info", e);

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
