import { compareSync, hashSync } from "bcryptjs";
import { NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { useCookie } from "@hooks/useCookie";
import useToken from "@hooks/useToken";
import { AnError, Ranks, Auth } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { Cad } from "src/interfaces/Cad";
import { IRequest } from "src/interfaces/IRequest";
import { User } from "src/interfaces/User";

export default async function (req: IRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const { username, password, password2 } = req.body;

        if (!username || !password || !password2) {
          return res.status(400).json({
            error: "Please fill in all fields",
            status: "error",
          });
        }

        if (password !== password2) {
          return res.status(400).json({ status: "error", error: "Passwords do not match" });
        }

        const [user] = await processQuery<User>("SELECT * FROM `users` WHERE `username` = ?", [
          username,
        ]);

        if (user) {
          return res.status(400).json({
            status: "error",
            error: "Username is already in use, please use a different username",
          });
        }

        const users = await processQuery<User>("SELECT `username` FROM `users`");
        const accountLevel = users.length <= 0 ? Ranks.Owner : Ranks.User;

        const hash = hashSync(password, Auth.SaltRounds);
        const id = uuid();
      } catch (e) {
        logger.error("REGISTER", e);

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
