import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { Call } from "types/Call";
import { IRequest } from "types/IRequest";
import { dbPath, mapCalls } from ".";
import { usePermission } from "hooks/usePermission";
import { formatRequired } from "lib/utils.server";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  if (req.query.type === "911") {
    try {
      await usePermission(req, ["dispatch", "leo", "ems_fd"]);
    } catch (e) {
      return res.status(e?.code ?? 401).json({
        status: "error",
        error: e,
      });
    }
  }

  switch (req.method) {
    case "PUT": {
      try {
        const tableName = dbPath(req.query.type.toString());
        const body = req.body;

        if (!body.claimed) {
          return res.status(400).json({
            error: formatRequired(["claimed"], body),
          });
        }

        const call = await global.connection
          .query<Call>()
          .select("*")
          .from(tableName)
          .where("id", req.query.id.toString())
          .exec();

        if (!call) {
          return res.status(404).json({
            error: "Call was not found",
            status: "error",
          });
        }

        await global.connection
          .query<Call>()
          .update(tableName, { claimed: "1" })
          .where("id", req.query.id.toString())
          .exec();

        const calls = await global.connection
          .query<Call>()
          .select("*")
          .from(dbPath(req.query.type.toString()))
          .exec();
        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls as Call[]) : calls,
          status: "success",
        });
      } catch (e) {
        logger.error("cad-info", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        await global.connection
          .query<Call>()
          .delete(dbPath(req.query.type.toString()))
          .where("id", req.query.id.toString())
          .exec();

        const calls = await global.connection
          .query<Call>()
          .select("*")
          .from(dbPath(`${req.query.type}`))
          .exec();

        return res.json({
          calls: req.query.type === "911" ? await mapCalls(calls as Call[]) : calls,
          status: "success",
        });
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
