import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
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
  } catch {
    null;
  }

  switch (req.method) {
    case "GET": {
      try {
        const [user] = await global.connection
          .query<User>()
          .select("rank")
          .from("users")
          .where("id", req.userId)
          .exec();

        const [cad] = await global.connection
          .query<Cad>()
          .select(["features", "registration_code"])
          .from("cad_info")
          .exec();

        const [seo] = await global.connection.query().select("*").from("seo_tags").exec();

        const features = parseFeatures(cad!);

        const code =
          user?.rank === "owner" ? cad?.registration_code ?? "" : !!cad?.registration_code;

        return res.json({
          seo,
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
