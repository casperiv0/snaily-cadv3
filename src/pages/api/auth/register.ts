import { hashSync } from "bcryptjs";
import { NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { useCookie } from "@hooks/useCookie";
import useToken from "@hooks/useToken";
import { AnError, Ranks, Auth, features } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { Cad } from "src/interfaces/Cad";
import { IRequest } from "src/interfaces/IRequest";
import { User } from "src/interfaces/User";

async function createCADAndReturn(username: string) {
  await processQuery(
    "INSERT INTO `cad_info` (`owner`, `cad_name`, `AOP`, `tow_whitelisted`, `whitelisted`, `webhook_url`, `live_map_url`, `plate_length`, `signal_100`, `steam_api_key`, `features`, `registration_code`, `show_aop`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      "Change me",
      "Change me",
      "0",
      "0",
      "",
      "",
      8,
      "0",
      "",
      JSON.stringify(features),
      "",
      "1",
    ],
  );

  return (await processQuery<Cad>("SELECT * FROM `cad_info`"))[0];
}

export default async function (req: IRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      try {
        const { username, password, password2, registration_code } = req.body;

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

        const cad =
          (await processQuery<Cad>("SELECT * FROM `cad_info`"))[0] ??
          (await createCADAndReturn(username));

        if (cad?.registration_code) {
          if (!registration_code)
            return res.status(400).json({
              error: "Please provide the registration code.",
              status: "error",
            });

          if (cad?.registration_code !== registration_code) {
            return res.status(400).json({
              error: "Invalid code",
              status: "error",
            });
          }
        }

        const whitelistStatus = cad?.whitelisted === "1" ? "pending" : "accepted";
        const towAccess = cad?.tow_whitelisted === "1" ? "0" : "1";
        const id = uuid();
        const hash = hashSync(password, Auth.SaltRounds);
        const perm = accountLevel === Ranks.Owner ? "1" : "0";

        // create the user
        await processQuery(
          "INSERT INTO `users` (`id`, `username`, `password`, `rank`, `leo`, `supervisor`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `edit_passwords`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id /* id */,
            username /* username */,
            hash /* password */,
            accountLevel /* rank */,
            perm /* leo access */,
            perm /* supervisor access */,
            perm /* ems_fd access */,
            perm /* dispatch access */,
            towAccess /* tow access */,
            "0" /* banned */,
            "" /* ban_reason */,
            whitelistStatus /* whitelist_status */,
            "" /* steam_id */,
            "" /* avatar_url */,
            perm /* edit_passwords */,
          ],
        );

        if (cad?.whitelisted === "1") {
          return res.status(401).json({
            status: "error",
            error:
              "Your account was successfully created, this CAD is whitelisted so your account is still pending access",
          });
        }

        const token = useToken(id);
        useCookie(res, token);

        return res.json({
          status: "success",
        });
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
