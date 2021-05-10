import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { useValidPath } from "@hooks/useValidPath";
import { v4 } from "uuid";
import { formatRequired } from "@lib/utils.server";
import { Value } from "types/Value";

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

        const values = await global.connection.query<Value>().select("*").from(parsedPath).exec();

        return res.json({ values, status: "success" });
      } catch (e) {
        logger.error("GET_VALUES", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { name } = req.body;
        const parsedPath = req.parsedPath;

        if (!name) {
          return res.status(400).json({
            error: formatRequired(["name"], req.body),
            status: "error",
          });
        }

        await global.connection
          .query<Value>()
          .insert(parsedPath, {
            id: v4(),
            name,
            defaults: "0",
          })
          .exec();

        const values = await global.connection.query<Value>().select("*").from(parsedPath).exec();

        return res.json({ status: "success", values });
      } catch (e) {
        logger.error("ADD_VALUE", e);

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
