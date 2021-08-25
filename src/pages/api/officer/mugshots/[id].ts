import { NextApiResponse } from "next";
import fs from "fs";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { processQuery } from "lib/database";
import { Mugshot } from "types/Mugshot";
import { parseMugshots } from ".";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  try {
    await usePermission(req, ["leo", "dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const { citizen_id, image_id } = req.query;
        const [citizen] = await processQuery("SELECT `id` FROM `citizens` WHERE `id` = ?", [
          citizen_id,
        ]);

        if (!citizen || !image_id) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const [mugShot] = await parseMugshots(
          await processQuery("SELECT * FROM `mugshots` WHERE `id` = ? AND `citizen_id` = ?", [
            req.query.id,
            citizen_id,
          ]),
        );

        const updatedData = mugShot.data.filter(
          (v) => v.toLowerCase() !== image_id.toString().toLowerCase(),
        );

        fs.unlink(`./public/mugshots/${image_id}`, (e) => {
          if (e) {
            logger.error("DELETE_MUG_SHOT", e);
          }
        });

        await processQuery("UPDATE `mugshots` SET `data` = ? WHERE `id` = ? AND `citizen_id` = ?", [
          JSON.stringify(updatedData),
          req.query.id,
          citizen_id,
        ]);

        const mugshots = await processQuery<Mugshot>(
          "SELECT * FROM `mugshots` WHERE `citizen_id` = ?",
          [citizen_id],
        );
        return res.json({ status: "success", mugshots: await parseMugshots(mugshots) });
      } catch (e) {
        logger.error("upload_mugshots", e);

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
