import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import { Cad } from "types/Cad";
import { User } from "types/User";
import useAuth from "@hooks/useAuth";

export function parseFeatures(cad: Cad): string[] {
  let features: string[];

  try {
    features = JSON.parse(`${cad?.features}`);
  } catch {
    features = [];
  }

  return features;
}

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    null;
  }

  switch (req.method) {
    case "GET": {
      try {
        const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
          req.userId,
        ]);
        const [cad] = await processQuery<Cad>(
          "SELECT `features`, `registration_code` FROM `cad_info`",
        );
        const features = parseFeatures(cad!);

        const code =
          user?.rank === "owner" ? cad?.registration_code ?? "" : !!cad?.registration_code;

        return res.json({
          registration_code: code,
          features,
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
