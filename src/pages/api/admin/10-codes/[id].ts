import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { Code10 } from "types/Code10";
import { formatRequired } from "@lib/utils.server";

export function parse10Codes(codes: Code10[]): Code10[] {
  return codes.map((code) => {
    try {
      code.what_pages = JSON.parse(`${code.what_pages}`);
    } catch {
      code.what_pages = [];
    }

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
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const body = req.body as Code10;

        if (
          !body.code ||
          body.what_pages?.length <= 0 ||
          !body.color ||
          !body.should_do ||
          !body.position
        ) {
          return res.status(400).json({
            error: formatRequired(
              ["code", "what_pages", "color", "should_do", "position"],
              req.body,
            ),
            status: "error",
          });
        }

        await global.connection
          .query<Code10>()
          .update("10_codes", {
            code: body.code,
            what_pages: JSON.stringify(body.what_pages) as any,
            color: body.color,
            should_do: body.should_do,
            position: body.position,
          })
          .where("id", `${req.query.id}`)
          .exec();

        const codes = await global.connection.query<Code10>().select("*").from("10_codes").exec();

        return res.json({
          status: "success",
          codes: parse10Codes(codes),
        });
      } catch (e) {
        logger.error("update_10_code", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        await global.connection
          .query<Code10>()
          .delete("10_codes")
          .where("id", `${req.query.id}`)
          .exec();

        const codes = await global.connection.query<Code10>().select("*").from("10_codes").exec();

        return res.json({
          status: "success",
          codes: parse10Codes(codes),
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
