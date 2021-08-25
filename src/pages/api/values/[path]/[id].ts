import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { usePermission } from "hooks/usePermission";
import { useValidPath } from "hooks/useValidPath";
import { formatRequired } from "lib/utils.server";
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
  try {
    await usePermission(req, ["admin", "owner", "moderator"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  await useValidPath(req);

  switch (req.method) {
    case "PUT": {
      try {
        const parsedPath = req.parsedPath;
        const { name } = req.body;

        if (!name) {
          return res
            .status(400)
            .json({ error: formatRequired(["name"], req.body), status: "error" });
        }

        await global.connection
          .query<Value>()
          .update(parsedPath, {
            name,
          })
          .where("id", `${req.query.id}`)
          .exec();

        const updated = await global.connection.query<Value>().select("*").from(parsedPath).exec();
        return res.json({ status: "success", values: updated });
      } catch (e) {
        logger.error("update_value", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        const parsedPath = req.parsedPath;

        await global.connection
          .query<Value>()
          .delete(parsedPath)
          .where("id", `${req.query.id}`)
          .exec();

        const updated = await global.connection.query<Value>().select("*").from(parsedPath).exec();
        return res.json({ status: "success", values: updated });
      } catch (e) {
        logger.error("delete_value", e);

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
