import { genSaltSync, hashSync } from "bcryptjs";
import { NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { useCookie } from "@hooks/useCookie";
import useToken from "@hooks/useToken";
import { AnError, Ranks, features } from "@lib/consts";
import { logger } from "@lib/logger";
import { Cad } from "src/interfaces/Cad";
import { IRequest } from "src/interfaces/IRequest";
import { User } from "types/User";

async function createCADAndReturn(username: string) {
  await global.connection
    .query<Cad>()
    .insert("cad_info", {
      owner: username,
      cad_name: "Change me",
      AOP: "Change me",
      tow_whitelisted: "0",
      whitelisted: "0",
      webhook_url: "",
      live_map_url: "",
      plate_length: 8,
      signal_100: "0",
      steam_api_key: "",
      features: JSON.stringify(features) as any,
      registration_code: "",
      show_aop: "1",
    })
    .exec();

  return (await global.connection.query<Cad>().select("*").from("cad_info").exec())[0];
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

        const [user] = await global.connection
          .query()
          .select("*")
          .from("users")
          .where("username", username)
          .exec();

        if (user) {
          return res.status(400).json({
            status: "error",
            error: "Username is already in use, please use a different username",
          });
        }

        const users = await global.connection.query().select("username").from("users").exec();
        const accountLevel = users.length <= 0 ? Ranks.Owner : Ranks.User;

        const cad =
          (await global.connection.query<Cad>().select("*").from("cad_info").limit(1).exec())[0] ??
          (await createCADAndReturn(username));

        if (cad?.registration_code) {
          if (!registration_code) {
            return res.status(400).json({
              error: "Please provide the registration code.",
              status: "error",
            });
          }

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
        const hash = hashSync(password, genSaltSync(15));
        const perm = accountLevel === Ranks.Owner ? "1" : "0";

        // create the user
        await global.connection
          .query<User>()
          .insert("users", {
            id,
            username,
            password: hash,
            rank: accountLevel,
            leo: perm,
            supervisor: perm,
            ems_fd: perm,
            dispatch: perm,
            tow: towAccess,
            banned: "0",
            ban_reason: "",
            whitelist_status: whitelistStatus,
            steam_id: "",
            avatar_url: "",
            edit_passwords: perm,
          })
          .exec();

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
