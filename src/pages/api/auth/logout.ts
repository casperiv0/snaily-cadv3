import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { useCookie } from "hooks/useCookie";
import { logoutActiveUnits } from "lib/utils.server";

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
    case "POST": {
      try {
        useCookie(res, "");
        await logoutActiveUnits(req.userId);

        return res.json({
          user: null,
          status: "success",
        });
      } catch (e) {
        logger.error("LOGIN", e);

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
