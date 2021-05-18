import { NextApiResponse } from "next";
import fileUpload from "express-fileupload";
import { formatRequired, runMiddleware } from "@lib/utils.server";
import useAuth from "@hooks/useAuth";
import { IRequest } from "types/IRequest";
import { Cad } from "types/Cad";
import { SupportedFileTypes } from "@lib/consts";
import { Citizen } from "types/Citizen";
import { v4 } from "uuid";
import { logger } from "@lib/logger";
import { Officer } from "types/Officer";
import { User } from "types/User";
import { SocketEvents } from "types/Socket";

export async function parseCitizens(citizens: (Citizen | undefined)[]) {
  const arr: Citizen[] = [];

  await Promise.all(
    citizens.map(async (citizen) => {
      const [officer] = await global.connection
        .query<Officer>()
        .select("*")
        .from("officers")
        .where("citizen_id", citizen?.id!)
        .exec();

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
      const citizens = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("user_id", req.userId)
        .exec();

      return res.json({
        citizens: await parseCitizens(citizens),
        status: "success",
      });
    }
    case "POST": {
      const file = req.files?.image ? req.files.image : null;
      const index = req.files?.image && file?.name.indexOf(".");
      const [cadInfo] = await global.connection.query<Cad>().select("*").from("cad_info").exec();

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
        const length = await global.connection
          .query()
          .select("id")
          .from("citizens")
          .where("user_id", req.userId)
          .exec();

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

      const [citizen] = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("full_name", body.full_name)
        .exec();

      if (citizen) {
        return res.status(400).json({
          status: "error",
          error: "Name is already in use!",
        });
      }

      const [user] = await global.connection
        .query<User>()
        .select("leo")
        .from("users")
        .where("id", req.userId)
        .exec();

      const imageId = file ? `${v4()}${file.name.slice(index)}` : "default.svg";
      const id = v4();

      if (body.create_officer === "true" && user?.leo === "1") {
        if (!body.department || !body.callsign) {
          return res.status(400).json({
            status: "error",
            error: formatRequired(["department", "callsign"], req.body),
          });
        }

        await global.connection
          .query<Officer>()
          .insert("officers", {
            id: v4(),
            officer_name: body.full_name,
            officer_dept: body.department,
            callsign: body.callsign,
            user_id: req.userId,
            status: "off-duty",
            status2: "",
            rank: "officer",
            suspended: "0",
            citizen_id: id,
          })
          .exec();
      }

      await global.connection
        .query<Citizen>()
        .insert("citizens", {
          id,
          full_name: body.full_name,
          user_id: req.userId,
          birth: body.birth,
          gender: body.gender,
          ethnicity: body.ethnicity,
          hair_color: body.hair_color,
          eye_color: body.eye_color,
          height: body.height,
          weight: body.weight,
          dmv: body.dmv,
          fire_license: body.fire_license,
          pilot_license: body.pilot_license,
          ccw: body.ccw,
          business_id: "",
          business: "none",
          rank: "",
          vehicle_reg: "1",
          posts: "1",
          image_id: imageId,
          b_status: "",
          note: "",
          phone_nr: body.phone_nr,
          dead: "0",
          dead_on: "",
          address: body.address,
          is_dangerous: "0",
          employee_of_the_month: "0",
        })
        .exec();

      file?.name &&
        file.mv(`./public/citizen-images/${imageId}`, (err: string) => {
          if (err) {
            logger.error("MOVE_CITIZEN_IMAGE", err);
          }
        });

      global.io?.sockets.emit(SocketEvents.UpdateNameSearchNames);

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
