import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { User } from "types/User";

export default async function (req: IRequest, res: NextApiResponse) {
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
        await global.connection
          .query<User>()
          .update("users", {
            steam_id: "",
          })
          .where("id", req.userId)
          .exec();

        return res.json({
          status: "success",
        });
      } catch (e) {
        logger.error("UNLINK_STEAM", e);

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
