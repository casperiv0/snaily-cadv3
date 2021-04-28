import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { Code10 } from "types/Code10";
import { formatRequired } from "@lib/utils.server";

export function parse10Codes(codes: Code10[]): Code10[] {
  return codes.map((code) => {
    code.what_pages = JSON.parse(`${code.what_pages}`);

    return code;
  });
}

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
    await usePermission(req, ["admin", "owner", "moderator", "supervisor"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const { title, des, jail_time } = req.body;

        if (!title || !des) {
          return res.status(400).json({
            error: formatRequired(["title", "des"], req.body),
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `penal_codes` SET `title` = ?, `des` = ?, `jail_time` = ? WHERE `id` = ?",
          [title, des, jail_time, req.query.id],
        );

        const updated = await processQuery("SELECT * FROM `penal_codes`");
        return res.json({
          status: "success",
          penalCodes: updated,
        });
      } catch (e) {
        logger.error("update_10_code", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        await processQuery("DELETE FROM `penal_codes` WHERE `id` = ?", [req.query.id]);

        const updated = await processQuery("SELECT * FROM `penal_codes`");
        return res.json({
          status: "success",
          penalCodes: updated,
        });
      } catch (e) {
        logger.error("delete_10_code", e);

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
