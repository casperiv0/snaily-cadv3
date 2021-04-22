import { processQuery } from "../lib/database";
import jwt from "jsonwebtoken";
import config from "../lib/config.server";
import { User } from "../interfaces/User";
import { Whitelist } from "../lib/consts";

export async function useSocketAuth(cookie: string): Promise<string> {
  const secret = config.jwtSecret;

  if (!cookie) {
    return Promise.reject({
      error: "no token provided. (Not Authenticated)",
      invalid_token: true,
      status: "error",
    });
  }

  try {
    const vToken = jwt.verify(cookie, secret.toString()) as User;
    const [user] = await processQuery<User>(
      "SELECT `id`, `username`, `whitelist_status` FROM `users` WHERE `id` = ?",
      [vToken.id],
    );

    if (!user) {
      return Promise.reject({ error: "user was not found", status: "error" });
    }

    if (user.whitelist_status === Whitelist.Pending) {
      return Promise.reject({
        error: "user is still pending access for CAD",
        status: "error",
      });
    }

    return Promise.resolve("Authorized");
  } catch (e) {
    console.log(e);

    return Promise.reject({
      error: "invalid token (Not Authenticated)",
      invalid_token: true,
      status: "error",
    });
  }
}
