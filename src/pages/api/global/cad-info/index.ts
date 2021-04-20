import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { Cad } from "types/Cad";
import { checkVersion } from "@lib/version.server";
import pkg from "../../../../../package.json";
import { User } from "types/User";
import { formatRequired } from "@lib/utils.server";
import { parseFeatures } from "./features";

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
        const [cad] = await processQuery<Cad>("SELECT * FROM `cad_info`");
        const [seoTags] = await processQuery<object>("SELECT * FROM `seo_tags`");
        const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
          req.userId,
        ]);
        const updatedVersion = await checkVersion(false);
        const code =
          user?.rank === "owner" ? cad?.registration_code ?? "" : !!cad?.registration_code;

        return res.json({
          cad: {
            ...cad,
            registration_code: code,
            seo: seoTags,
            features: parseFeatures(cad!),
            version: { version: pkg.version, updatedVersion },
          },
          status: "success",
        });
      } catch (e) {
        logger.error("cad-info", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
          req.userId,
        ]);

        if (user?.rank !== "owner") {
          return res.status(401).json({
            error: "Forbidden",
            status: "error",
          });
        }

        const {
          cad_name,
          aop,
          tow_whitelisted,
          whitelisted,
          webhook_url,
          plate_length = 8,
          live_map_url,
          steam_api_key,
          features,
          max_citizens,
          show_aop,
          registration_code = null,
        } = req.body;

        if (!cad_name && !aop && !tow_whitelisted && !whitelisted) {
          return res.json({
            error: formatRequired(["cad_name", "aop", "tow_whitelisted", "whitelisted"], req.body),
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `cad_info` SET `cad_name` = ?, `AOP` = ?, `tow_whitelisted` = ?, `whitelisted` = ?, `webhook_url`= ?, `plate_length` = ?, `live_map_url` = ?, `steam_api_key` = ?, `features` = ?, `max_citizens` = ?, `show_aop` = ?, `registration_code` = ?",
          [
            cad_name,
            aop,
            tow_whitelisted,
            whitelisted,
            webhook_url,
            plate_length,
            live_map_url,
            steam_api_key,
            JSON.stringify(features) || JSON.stringify("[]"),
            max_citizens,
            show_aop,
            registration_code,
          ],
        );

        const [updated] = await processQuery<Cad>("SELECT * FROM `cad_info`");
        const updatedFeatures = parseFeatures(updated!);
        const code =
          user?.rank === "owner" ? updated?.registration_code ?? "" : !!updated?.registration_code;

        return res.json({
          status: "success",
          cad: {
            ...updated,
            registration_code: code,
            features: updatedFeatures,
          },
        });
      } catch (e) {
        logger.error("update_cad_info", e);
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
