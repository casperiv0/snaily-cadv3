import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import { Cad } from "types/Cad";

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
  switch (req.method) {
    case "GET": {
      try {
        const [cad] = await processQuery<Cad>("SELECT `features` FROM `cad_info`");
        const features = parseFeatures(cad!);

        return res.json({
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
