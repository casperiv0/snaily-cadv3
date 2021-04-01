import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { processQuery } from "../lib/database";
import config from "../lib/config";
import IRequest from "../interfaces/IRequest";
import IUser from "../interfaces/IUser";
import { Whitelist } from "../lib/constants";
import { logoutActiveUnits } from "../lib/functions";

async function useAuth(req: IRequest, res: Response, next: NextFunction): Promise<void | Response> {
  const token = req.cookies["snaily-cad-session"];
  const secret = config.jwtSecret;

  if (!token) {
    return res
      .json({ server_error: "invalid token", status: "error", invalid_token: true })
      .status(401);
  }

  try {
    const vToken = jwt.verify(token, secret) as IUser;
    const user = await processQuery<IUser>("SELECT `id`  FROM `users` WHERE `id` = ?", [vToken.id]);

    if (!user[0]) {
      return res.json({
        invalid_token: true,
        server_error: "user does not exist",
        status: "error",
      });
    }

    if (user[0].whitelist_status === Whitelist.pending) {
      return Promise.reject({
        error: "user is still pending access for CAD",
        status: "error",
      });
    }

    if (user[0].banned === "1") {
      return res.json({
        status: "error",
        error: `This account was banned, reason: ${user[0].ban_reason}`,
      });
    }

    req.userId = user[0].id;

    next();
  } catch (e) {
    await logoutActiveUnits(req.userId);

    return res
      .json({ invalid_token: true, server_error: "invalid token", status: "error" })
      .status(401);
  }
}

export default useAuth;
