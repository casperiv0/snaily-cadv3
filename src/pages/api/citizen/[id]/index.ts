import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { logger } from "@lib/logger";
import { AnError } from "@lib/consts";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    await useAuth(req, res);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "GET": {
      try {
        const [
          citizen,
        ] = await processQuery("SELECT * FROM `citizens` WHERE `id` = ? AND `user_id` = ?", [
          query.id,
          req.userId,
        ]);

        return res.json({
          citizen,
          status: "success",
        });
      } catch (e) {
        logger.error("GET_CITIZENS", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      // TODO: update citizen
      break;
    }
    case "DELETE": {
      try {
        const [
          citizen,
        ] = await processQuery("SELECT * FROM `citizens` WHERE `id` = ? AND `user_id` = ?", [
          query.id,
          req.userId,
        ]);

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        await processQuery("DELETE FROM `registered_weapons` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `registered_cars` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `court_requests` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `posts` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [query.id]);

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("DELETE_CITIZEN", e);

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
