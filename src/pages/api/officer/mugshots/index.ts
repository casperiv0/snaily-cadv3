import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import fileUpload from "express-fileupload";
import { AnError } from "lib/consts";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { getActiveOfficer, runMiddleware } from "lib/utils.server";
import { v4 } from "uuid";
import { processQuery } from "lib/database";
import { Mugshot } from "types/Mugshot";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function parseMugshots(mugshots: (Mugshot | undefined)[]) {
  const arr: Mugshot[] = [];

  await Promise.all(
    mugshots.map((shot) => {
      if (!shot) {
        return;
      }

      const data = shot.data ?? "[]";

      try {
        shot.data = JSON.parse(`${data}`);
      } catch {
        shot.data = [];
      }

      arr.push(shot);
    }),
  );

  return arr;
}

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  await runMiddleware(req, res, fileUpload());

  try {
    await usePermission(req, ["leo", "dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const { citizen_id } = req.query;
        const [citizen] = await processQuery("SELECT `id` FROM `citizens` WHERE `id` = ?", [
          citizen_id,
        ]);

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

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
    case "POST": {
      try {
        const files = req.files;
        const { citizen_id } = req.query;
        const officer = await getActiveOfficer(req);

        if (!officer) {
          return res.status(400).json({
            error: "You must be on-duty todo this",
            status: "error",
          });
        }

        if (!citizen_id) {
          return res.status(400).json({
            error: "`citizen_id` must be provided",
            status: "error",
          });
        }

        if (!files) {
          return res.status(400).json({
            error: "error",
          });
        }

        const [citizen] = await processQuery("SELECT `id` FROM `citizens` WHERE `id` = ?", [
          citizen_id,
        ]);

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const fileIds: string[] = [];
        for (const fileName in files) {
          const file = files[fileName];
          const index = file?.name.indexOf(".");
          const imageId = `${v4()}-${file?.name}${file?.name.slice(index)}`;

          fileIds.push(imageId);

          file?.mv(`./public/mugshots/${imageId}`, (err) => {
            if (err) {
              logger.error("MOVE_MUGSHOTS", err);
            }
          });
        }

        const [existing] = await parseMugshots(
          await processQuery<Mugshot>("SELECT * FROM `mugshots` WHERE `citizen_id` = ?", [
            citizen_id,
          ]),
        );

        if (existing) {
          existing.data.forEach((i) => fileIds.push(i));

          await processQuery(
            "UPDATE `mugshots` SET `data` = ? WHERE `id` = ? AND `citizen_id` = ?",
            [JSON.stringify(fileIds), existing.id, citizen_id],
          );

          return res.json({ status: "success" });
        }

        await processQuery(
          "INSERT INTO `mugshots` (`id`, `citizen_id`, `officer_name`, `full_date`, `data`, `officer_id`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            v4(),
            citizen_id,
            ` ${officer.callsign} ${officer.officer_name}`,
            Date.now(),
            JSON.stringify(fileIds),
            officer.id,
          ],
        );

        return res.json({ status: "success" });
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
