import { NextApiResponse } from "next";
import { genSaltSync, hashSync } from "bcryptjs";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { usePermission } from "hooks/usePermission";
import { User } from "types/User";
import { generateString } from "lib/utils.server";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  try {
    await usePermission(req, ["admin", "owner"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "POST": {
      try {
        const [user] = await processQuery<User>(
          "SELECT `rank`, `edit_passwords` FROM `users` WHERE `id` = ?",
          [req.userId],
        );

        if (user?.edit_passwords === "1" || ["admin", "owner"].includes(user?.rank ?? "user")) {
          const randomString = generateString(8, "#@&§è!çà-_$ù£=/?:");

          const hash = hashSync(randomString, genSaltSync(15));

          await processQuery("UPDATE `users` SET `password` = ? WHERE `id` = ?", [
            hash,
            req.query.id,
          ]);

          return res.json({
            status: "success",
            tempPassword: randomString,
          });
        }
        return res.status(403).json({
          status: "error",
          error: "Forbidden",
        });
      } catch (e) {
        logger.error("get_temp_password", e);

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
