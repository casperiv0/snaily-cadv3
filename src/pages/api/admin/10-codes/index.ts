import { v4 } from "uuid";
import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { Code10 } from "types/Code10";
import { formatRequired } from "@lib/utils";

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
    await usePermission(req, ["admin", "owner", "moderator"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const codes = await processQuery<Code10>("SELECT * FROM `10_codes`");

        return res.json({
          status: "success",
          codes: parse10Codes(codes),
        });
      } catch (e) {
        logger.error("get_10_Codes", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { code, what_pages, color, should_do, position } = req.body;

        if (!code || what_pages?.length <= 0 || !color || !should_do || !position) {
          return res.status(400).json({
            error: formatRequired(
              ["code", "what_pages", "color", "should_do", "position"],
              req.body,
            ),
            status: "error",
          });
        }

        const [exists] = await processQuery("SELECT * FROM `10_codes` WHERE `code` = ?", [code]);

        if (exists) {
          return res.status(400).json({
            error: "Code already exists",
            status: "error",
          });
        }

        await processQuery(
          "INSERT INTO `10_codes` (`id`, `code`, `color`, `what_pages`, `should_do`, `position`) VALUES (?, ?, ?, ?, ?, ?)",
          [v4(), code, color, JSON.stringify(what_pages), should_do, position],
        );

        const codes = await processQuery<Code10>("SELECT * FROM `10_codes`");
        return res.json({
          status: "success",
          codes: parse10Codes(codes),
        });
      } catch (e) {
        logger.error("add_10_Codes", e);

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
