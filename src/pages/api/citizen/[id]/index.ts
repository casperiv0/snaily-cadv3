import { NextApiResponse } from "next";
import { v4 } from "uuid";
import fs from "fs";
import fileUpload from "express-fileupload";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { logger } from "@lib/logger";
import { AnError, SupportedFileTypes } from "@lib/consts";
import { formatRequired, runMiddleware } from "@lib/utils.server";
import { Citizen } from "types/Citizen";
import { parseCitizens } from "..";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method, query } = req;

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
      try {
        const [citizen] = await processQuery<Citizen>(
          "SELECT * FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
          [query.id, req.userId],
        );

        return res.json({
          citizen: await (await parseCitizens([citizen]))[0],
          status: "success",
        });
      } catch (e) {
        logger.error("GET_CITIZENS", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const {
          full_name,
          gender,
          ethnicity,
          birth,
          hair_color,
          eye_color,
          address,
          height,
          weight,
          phone_nr,
        } = req.body;
        const deleteImage = req.body?.image === "delete";

        if (
          !full_name ||
          !gender ||
          !ethnicity ||
          !birth ||
          !hair_color ||
          !eye_color ||
          !address ||
          !height ||
          !weight
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
                "heigh",
                "weight",
              ],
              req.body,
            ),
            status: "error",
          });
        }

        const file = req.files?.image ? req.files.image : null;
        const index = req.files?.image && file?.name.indexOf(".");

        if (!deleteImage && file && !SupportedFileTypes.includes(String(file.mimetype))) {
          return res.status(400).json({
            status: "error",
            error: `Image type is not supported, supported: ${SupportedFileTypes.join(", ")}`,
          });
        }

        let imageId = "default.svg";
        if (!deleteImage && file) {
          imageId = `${v4()}${file.name.slice(index)}`;
        }

        const [citizen] = await processQuery<Citizen>(
          "SELECT * FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
          [req.query.id, req.userId],
        );

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        const query =
          "UPDATE `citizens` SET `birth` = ?, `gender` = ?, `ethnicity` = ?, `hair_color` = ?, `eye_color` = ?, `address` = ?, `height` = ?, `weight` = ?, `phone_nr` = ? WHERE `id` = ?";

        await processQuery(query, [
          birth /* birth */,
          gender /* gender */,
          ethnicity /* ethnicity */,
          hair_color /* hair_color */,
          eye_color /* eye_color */,
          address /* address */,
          height /* height */,
          weight /* weight */,
          phone_nr /* phone number */,
          req.query.id /* id */,
        ]);

        if (deleteImage === true) {
          imageId !== "default.svg" &&
            fs.unlink(`./public/citizen-images/${citizen.image_id}`, () => {
              null;
            });

          await processQuery("UPDATE `citizens` SET `image_id` = ? WHERE `id` = ?", [
            "default.svg",
            req.query.id,
          ]);
        }

        if (!deleteImage && file) {
          await processQuery("UPDATE `citizens` SET `image_id` = ? WHERE `id` = ?", [
            imageId,
            req.query.id,
          ]);

          // delete the old image
          imageId !== "default.svg" &&
            fs.unlink(`./public/citizen-images/${citizen.image_id}`, () => {
              null;
            });

          // add the new image
          file.mv("./public/citizen-images/" + imageId, (err: string) => {
            if (err) {
              logger.error("MOVE_CITIZEN_IMAGE", err);
            }
          });
        }

        return res.json({ status: "success", citizenId: req.query.id });
      } catch (e) {
        logger.error("DELETE_CITIZEN", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        const [citizen] = await processQuery(
          "SELECT * FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
          [query.id, req.userId],
        );

        if (!citizen) {
          return res.status(404).json({
            error: "Citizen was not found",
            status: "error",
          });
        }

        await processQuery("DELETE FROM `registered_weapons` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `registered_cars` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `court_requests` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `posts` WHERE `citizen_id` = ?", [query.id]);
        await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [query.id]);

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("DELETE_CITIZEN", e);

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
