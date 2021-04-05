import { compareSync } from "bcryptjs";
import { NextApiResponse } from "next";
import { useCookie } from "@hooks/useCookie";
import useToken from "@hooks/useToken";
import { Whitelist, AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { Cad } from "src/interfaces/Cad";
import { IRequest } from "src/interfaces/IRequest";
import { User } from "src/interfaces/User";

export default async function (req: IRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res.status(400).json({
            error: "Please fill in all fields",
            status: "error",
          });
        }

        const [user] = await processQuery<User>("SELECT * FROM `users` WHERE `username` = ?", [
          username,
        ]);
        const [cadInfo] = await processQuery<Cad>("SELECT * FROM `cad_info`");

        if (!user) {
          return res.status(400).json({
            error: "User was not found",
            status: "error",
          });
        }

        const isPasswordCorrect = compareSync(password, user.password);

        if (!isPasswordCorrect) {
          return res.status(400).json({
            error: "password is incorrect",
            status: "error",
          });
        }

        if (user.banned === "1") {
          return res.status(400).json({
            error: `This account was banned. Reason: ${user.ban_reason}`,
            status: "error",
          });
        }

        if (cadInfo.whitelisted === "1" && user.whitelist_status === Whitelist.Pending) {
          return res.status(400).json({
            error: "This account is still pending access",
            status: "error",
          });
        }

        const token = useToken(user.id);
        useCookie(res, token);

        return res.json({
          status: "success",
          user: {
            id: user.id,
          },
        });
      } catch (e) {
        logger.error("LOGIN", e);

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
