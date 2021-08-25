import jwt from "jsonwebtoken";
import config from "../lib/config.server";
import { User } from "types/User";
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
    const [user] = await global.connection
      .query<User>()
      .select(["id", "whitelist_status", "banned"])
      .from("users")
      .where("id", vToken.id)
      .exec();

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
    return Promise.reject({
      error: "invalid token (Not Authenticated)",
      invalid_token: true,
      status: "error",
    });
  }
}
