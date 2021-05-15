import { v4 } from "uuid";
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
    await usePermission(req, ["admin", "owner", "moderator", "leo"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const codes = await global.connection.query<Code10>().select("*").from("10_codes").exec();

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

        const [exists] = await global.connection
          .query<Code10>()
          .select("*")
          .from("10_codes")
          .where("code", body.code)
          .exec();

        if (exists) {
          return res.status(400).json({
            error: "Code already exists",
            status: "error",
          });
        }

        await global.connection
          .query<Code10>()
          .insert("10_codes", {
            id: v4(),
            code: body.code,
            color: body.color,
            what_pages: JSON.stringify(body.what_pages) as any,
            should_do: body.should_do,
            position: body.position,
          })
          .exec();

        const codes = await global.connection.query<Code10>().select("*").from("10_codes").exec();

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
