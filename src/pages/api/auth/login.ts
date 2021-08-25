import { compareSync } from "bcryptjs";
import { NextApiResponse } from "next";
import { useCookie } from "hooks/useCookie";
import useToken from "hooks/useToken";
import { Whitelist, AnError } from "lib/consts";
import { logger } from "lib/logger";
import { Cad } from "types/Cad";
import { IRequest } from "types/IRequest";
import { User } from "types/User";

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

        const [user] = await global.connection
          .query<User>()
          .select(["id", "rank", "password"])
          .from("users")
          .where("username", username)
          .exec();

        const [cadInfo] = await global.connection.query<Cad>().select("*").from("cad_info").exec();

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

        if (cadInfo?.whitelisted === "1" && user.whitelist_status === Whitelist.Pending) {
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
