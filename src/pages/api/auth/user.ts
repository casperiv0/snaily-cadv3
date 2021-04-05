import { NextApiResponse } from "next";
import { SaveUserQueryData, AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";

export default async function (req: IRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const [
          user,
        ] = await processQuery(`SELECT ${SaveUserQueryData} FROM \`users\` WHERE \`id\` = ?`, [
          req.userId,
        ]);

        return res.json({
          user,
          status: "success",
        });
      } catch (e) {
        logger.error("LOGIN", e);

        return res.status(500).json(AnError);
      }
    }

    // TODO: add DELETE method.

    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
