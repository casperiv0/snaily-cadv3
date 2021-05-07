import { NextApiResponse } from "next";
import fileUpload from "express-fileupload";
import { formatRequired, runMiddleware } from "@lib/utils.server";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Cad } from "types/Cad";
import { SupportedFileTypes } from "@lib/consts";
import { Citizen } from "types/Citizen";
import { v4 } from "uuid";
import { logger } from "@lib/logger";
import { Officer } from "types/Officer";

export async function parseCitizens(citizens: (Citizen | undefined)[]) {
  const arr: Citizen[] = [];

  await Promise.all(
    citizens.map(async (citizen) => {
      const [officer] = await processQuery<Officer>(
        "SELECT * FROM `officers` WHERE `citizen_id` = ?",
        [citizen?.id],
      );

      if (officer && citizen) {
        citizen.officer = {
          officer_name: officer.officer_name,
          callsign: officer.callsign,
        };
      }

      return arr.push(citizen!);
    }),
  );

  return arr;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  await runMiddleware(req, res, fileUpload());

  switch (method) {
    case "GET": {
      const citizens = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `user_id` = ?", [
        req.userId,
      ]);

      return res.json({
        citizens: await parseCitizens(citizens),
        status: "success",
      });
    }
    case "POST": {
      const file = req.files?.image ? req.files.image : null;
      const index = req.files?.image && file?.name.indexOf(".");
      const [cadInfo] = await processQuery<Cad>("SELECT * FROM `cad_info`");

      const body = req.body;

      if (
        !body.full_name ||
        !body.gender ||
        !body.ethnicity ||
        !body.birth ||
        !body.hair_color ||
        !body.eye_color ||
        !body.address ||
        !body.height ||
        !body.weight
      ) {
        return res.status(400).json({
          error: formatRequired(
            [
              "full_name",
              "gender",
              "ethnicity",
              "birth",
              "hair_color",
              "eye_color",
              "address",
              "height",
              "weight",
            ],
            req.body,
          ),
          status: "error",
        });
      }

      if (cadInfo?.max_citizens !== "unlimited") {
        const length = await processQuery("SELECT `id` FROM `citizens` WHERE `user_id` = ?", [
          req.userId,
        ]);

        if (length.length > parseInt(cadInfo?.max_citizens ?? "0")) {
          return res.status(400).json({
            error: `You have reached your limited of citizens (Max: ${cadInfo?.max_citizens})`,
            status: "error",
          });
        }
      }

      if (file && !SupportedFileTypes.includes(String(file.mimetype))) {
        return res.status(400).json({
          status: "error",
          error: `Image type is not supported, supported: ${SupportedFileTypes.join(", ")}`,
        });
      }

      const [citizen] = await processQuery<Citizen>(
        "SELECT * FROM `citizens` WHERE `full_name` = ?",
        [body.full_name],
      );

      if (citizen) {
        return res.status(400).json({
          status: "error",
          error: "Name is already in use!",
        });
      }

      const imageId = file ? `${v4()}${file.name.slice(index)}` : "default.svg";
      const id = v4();

      if (body.create_officer === "true") {
        if (!body.department || !body.callsign) {
          return res.status(400).json({
            status: "error",
            error: formatRequired(["department", "callsign"], req.body),
          });
        }

        await processQuery(
          "INSERT INTO `officers` (`id`, `officer_name`,`officer_dept`,`callsign`,`user_id`,`status`,`status2`,`rank`,`citizen_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            v4(),
            body.full_name,
            body.department,
            body.callsign,
            req.userId,
            "off-duty",
            "",
            "officer",
            id,
          ],
        );
      }

      const query =
        "INSERT INTO `citizens` (`id`, `full_name`, `user_id`, `birth`, `gender`, `ethnicity`, `hair_color`, `eye_color`, `address`, `height`, `weight`, `dmv`, `fire_license`, `pilot_license`, `ccw`, `business`, `business_id`, `rank`, `vehicle_reg`, `posts`, `image_id`, `b_status`, `note`, `phone_nr`, `dead`, `dead_on`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      await processQuery(query, [
        id /* Id */,
        body.full_name /* full name */,
        req.userId /* user_id */,
        body.birth /* birth */,
        body.gender /* gender */,
        body.ethnicity /* ethnicity */,
        body.hair_color /* hair_color */,
        body.eye_color /* eye_color */,
        body.address /* address */,
        body.height /* height */,
        body.weight /* weight */,
        body.dmv /* dmv */,
        body.fire_license /* fire_license */,
        body.pilot_license /* pilot_license */,
        body.ccw /* ccw */,
        "none" /* business */,
        "" /* business_id */,
        "none" /* rank */,
        true /* vehicle_reg */,
        true /* posts */,
        imageId /* image_id */,
        "" /* b_status */,
        "" /* note */,
        body.phone_nr || "" /* phone_nr */,
        "0",
        "",
      ]);

      file?.name &&
        file.mv("./public/citizen-images/" + imageId, (err: string) => {
          if (err) {
            logger.error("MOVE_CITIZEN_IMAGE", err);
          }
        });

      return res.json({
        citizenId: id,
        status: "success",
      });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
