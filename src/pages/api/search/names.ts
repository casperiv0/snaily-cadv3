import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";

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
    case "GET": {
      try {
        const names = await global.connection
          .query()
          .select(["id", "full_name"])
          .from("citizens")
          .exec();

        return res.json({
          names,
          status: "success",
        });
      } catch (e) {
        logger.error("name_search", e);

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
