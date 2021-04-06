import { NextApiResponse } from "next";
import { SaveUserQueryData, AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { User } from "types/User";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req, res);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "POST": {
      try {
        const [
          user,
        ] = await processQuery(`SELECT ${SaveUserQueryData} FROM \`users\` WHERE \`id\` = ?`, [
          req.userId,
        ]);

        return res.json({
          user,
          status: "success",
        });
      } catch (e) {
        logger.error("LOGIN", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
        req.userId,
      ]);

      if (user.rank === "owner") {
        return res.json({
          error: "The owner is not able to delete their account!",
          status: "error",
        });
      }

      const citizens = await processQuery<any>("SELECT * FROM `citizens` WHERE `user_id` = ?", [
        req.userId,
      ]);

      await Promise.all(
        citizens.map(async (citizen) => {
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
