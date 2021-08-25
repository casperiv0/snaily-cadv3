import { NextApiResponse } from "next";
import { AnError, SaveUserDataArr } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { User } from "types/User";
import { compareSync, hashSync } from "bcryptjs";
import { Citizen } from "types/Citizen";

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
        const [user] = await global.connection
          .query()
          .select(SaveUserDataArr)
          .from("users")
          .where("id", req.userId)
          .exec();

        return res.json({
          user,
          status: "success",
        });
      } catch (e) {
        logger.error("LOGIN", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      const { oldPassword, newPassword, newPassword2 } = req.body;

      if (!oldPassword || !newPassword || !newPassword2) {
        return res.status(400).json({
          error: "Please fill in all fields",
          status: "error",
        });
      }

      const [user] = await global.connection
        .query()
        .select("id")
        .from("users")
        .where("id", req.userId)
        .exec();

      if (!user) {
        return res.status(404).json({ error: "User was not found", status: "error" });
      }

      if (newPassword !== newPassword2) {
        return res.status(400).json({ error: "New passwords do not match", status: "error" });
      }

      const isCorrect = compareSync(oldPassword, user.password);
      if (!isCorrect) {
        return res.status(404).json({ error: "Old Password does not match!" });
      }

      const hash = hashSync(newPassword);
      await processQuery("UPDATE `users` SET `password` = ? WHERE `id` = ?", [hash, req.userId]);

      return res.json({ status: "success" });
    }
    case "DELETE": {
      const [user] = await global.connection
        .query<User>()
        .select("rank")
        .from("users")
        .where("id", req.userId)
        .exec();

      if (user?.rank === "owner") {
        return res.status(400).json({
          error: "The owner is not able to delete their account!",
          status: "error",
        });
      }

      const citizens = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("user_id", req.userId)
        .exec();

      await Promise.all(
        citizens.map(async (citizen) => {
          if (!citizen) return [];

          await processQuery("DELETE FROM `arrest_reports` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `businesses` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `leo_tickets` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `medical_records` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `registered_cars` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `registered_weapons` WHERE `citizen_id` = ?", [
            citizen.id,
          ]);
          await processQuery("DELETE FROM `warrants` WHERE `citizen_id` = ?", [citizen.id]);
          await processQuery("DELETE FROM `written_warnings` WHERE `citizen_id` = ?", [citizen.id]);
        }),
      );

      await Promise.all([
        await processQuery("DELETE FROM `posts` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `truck_logs` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `officers` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `ems-fd` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `bleets` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `citizens` WHERE `user_id` = ?", [req.userId]),
        await processQuery("DELETE FROM `users` WHERE `id` = ?", [req.userId]),
      ]);

      return res.json({ status: "success" });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
