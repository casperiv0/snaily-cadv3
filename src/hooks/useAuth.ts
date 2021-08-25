import jwt from "jsonwebtoken";
import config from "../lib/config.server";
import { IRequest } from "types/IRequest";
import { User } from "types/User";
import { Whitelist } from "lib/consts";
import { parse } from "cookie";

import { logoutActiveUnits } from "lib/utils.server";
import { IError } from "types/IError";

async function useAuth(req: IRequest): Promise<IError> {
  const token =
    req.cookies["snaily-cad-session"] || parse(`${req.headers.session}`)?.["snaily-cad-session"];

  const secret = config.jwtSecret;

  if (!token) {
    return Promise.reject({ msg: "invalid token", code: 401, invalid_token: true });
  }

  try {
    const vToken = jwt.verify(token as string, secret) as { id: string };
    const [user] = await global.connection
      .query<User>()
      .select(["id", "whitelist_status", "banned"])
      .from("users")
      .where("id", vToken.id)
      .exec();

    if (!user) {
      return Promise.reject({
        msg: "user does not exist",
        code: 400,
      });
    }

    if (user.whitelist_status === Whitelist.Pending) {
      return Promise.reject({
        error: "user is still pending access for CAD",
        status: "error",
      });
    }

    if (user.banned === "1") {
      return Promise.reject({
        msg: `This account was banned, reason: ${user.ban_reason}`,
        code: 401,
      });
    }

    req.userId = user.id;

    return Promise.resolve({ msg: "Authenticated", code: 200 });
  } catch (e) {
    await logoutActiveUnits(req.userId);

    return Promise.reject({ msg: "invalid token", code: 401, invalid_token: true });
  }
}

export default useAuth;
