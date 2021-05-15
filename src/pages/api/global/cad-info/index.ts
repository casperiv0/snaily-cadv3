import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { Cad } from "types/Cad";
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
        const [seoTags] = await processQuery("SELECT * FROM `seo_tags`");
        const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
          req.userId,
        ]);

        const code =
          user?.rank === "owner" ? cad?.registration_code ?? "" : !!cad?.registration_code;

        return res.json({
          cad: {
            ...cad,
            registration_code: code,
            seo: seoTags,
            features: parseFeatures(cad!),
            version: { version: pkg.version, updatedVersion: global.CAD_VERSION },
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

        const body = req.body;

        if (!body.cad_name && !body.aop && !body.tow_whitelisted && !body.whitelisted) {
          return res.json({
            error: formatRequired(["cad_name", "aop", "tow_whitelisted", "whitelisted"], req.body),
            status: "error",
          });
        }

        await global.connection
          .query<Cad>()
          .update("cad_info", {
            cad_name: body.cad_name,
            AOP: body.aop,
            tow_whitelisted: body.tow_whitelisted,
            whitelisted: body.whitelisted,
            webhook_url: body.webhook_url,
            plate_length: body.plate_length,
            live_map_url: body.live_map_url,
            steam_api_key: body.steam_api_key,
            features: JSON.stringify(body.features) || (JSON.stringify("[]") as any),
            max_citizens: body.max_citizens,
            show_aop: body.show_aop,
            registration_code: body.registration_code,
            weight_prefix: body.weight_prefix,
            height_prefix: body.height_prefix,
            assigned_status: body.assigned_status,
            on_duty_status: body.on_duty_status,
            change_usernames: body.change_usernames,
          })
          .exec();

        const [seoTags] = await processQuery("SELECT * FROM `seo_tags`");

        if (!seoTags) {
          await global.connection
            .query<Cad["seo"]>()
            .insert("seo_tags", {
              title: body.cad_name,
              description: body.seo_description,
            })
            .exec();
        } else {
          await global.connection
            .query<Cad["seo"]>()
            .update("seo_tags", {
              title: body.cad_name,
              description: body.seo_description,
            })
            .exec();
        }

        const [updated] = await processQuery<Cad>("SELECT * FROM `cad_info`");
        const [updatedSeo] = await global.connection.query().select("*").from("seo_tags").exec();

        const updatedFeatures = parseFeatures(updated!);
        const code =
          user?.rank === "owner" ? updated?.registration_code ?? "" : !!updated?.registration_code;

        return res.json({
          status: "success",
          cad: {
            ...updated,
            seo: updatedSeo,
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
