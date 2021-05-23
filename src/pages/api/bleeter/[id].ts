import { NextApiResponse } from "next";
import fs from "fs";
import useAuth from "@hooks/useAuth";
import { IRequest } from "types/IRequest";
import { logger } from "@lib/logger";
import { AnError, RanksArr } from "@lib/consts";
import { Bleet } from "types/Bleet";
import { User } from "types/User";
import { formatRequired } from "@lib/utils.server";

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

  switch (method) {
    case "GET": {
      try {
        const [bleet] = await global.connection
          .query<Bleet>()
          .select("*")
          .from("bleets")
          .where("id", `${req.query.id}`)
          .exec();

        const [uploadedBy] = await global.connection
          .query<User>()
          .select("username")
          .from("users")
          .where("id", bleet.user_id)
          .exec();

        return res.json({
          status: "success",
          bleet: { ...bleet, uploadedBy: uploadedBy?.username ?? null },
        });
      } catch (e) {
        logger.error("get_bleets", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const [bleet] = await global.connection
          .query<Bleet>()
          .select("*")
          .from("bleets")
          .where("id", `${req.query.id}`)
          .exec();

        const [uploadedBy] = await global.connection
          .query<User>()
          .select("username")
          .from("users")
          .where("id", bleet.user_id)
          .exec();

        if (!bleet) {
          return res.status(404).json({
            error: "Bleet was not found",
            status: "error",
          });
        }

        if (bleet.user_id !== req.userId) {
          return res.status(403).json({
            error: "Forbidden",
            status: "error",
          });
        }

        const { title, body } = req.body;

        if (!title || !body) {
          return res.status(400).json({
            error: formatRequired(["title", "body"], req.body),
            status: "error",
          });
        }

        await global.connection
          .query<Bleet>()
          .update("bleets", {
            title,
            body,
          })
          .where("id", `${req.query.id}`)
          .exec();

        const [updated] = await global.connection
          .query<Bleet>()
          .select("*")
          .from("bleets")
          .where("id", `${req.query.id}`)
          .exec();

        return res.json({
          status: "success",
          bleet: {
            ...updated,
            uploadedBy: uploadedBy?.username,
          },
        });
      } catch (e) {
        logger.error("get_bleets", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        const [user] = await global.connection
          .query<User>()
          .select("rank")
          .from("users")
          .where("id", req.userId)
          .exec();

        const rank = user?.rank ?? "user";
        const [bleet] = await global.connection
          .query<Bleet>()
          .select("*")
          .from("bleets")
          .where("id", `${req.query.id}`)
          .exec();

        if (!bleet) {
          return res.status(404).json({ status: "error", error: "Bleet was not found" });
        }

        if (RanksArr.includes(rank) || bleet.user_id === req.userId) {
          await global.connection.query().delete("bleets").where("id", `${req.query.id}`).exec();

          // delete the old image
          fs.unlink(`./public/bleeter-images/${bleet.image_id}`, () => {
            null;
          });

          return res.json({ status: "success" });
        }
        return res.status(403).json({ error: "Forbidden", status: "error" });
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
