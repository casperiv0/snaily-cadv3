import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { Call } from "types/Call";
import { IRequest } from "types/IRequest";
import { dbPath } from ".";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        await processQuery(`DELETE FROM \`${dbPath(`${req.query.type}`)}\` WHERE \`id\` = ?`, [
          req.query.id,
        ]);

        const calls = await processQuery<Call>(`SELECT * FROM \`${dbPath(`${req.query.type}`)}\``);
        return res.json({
          calls,
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
