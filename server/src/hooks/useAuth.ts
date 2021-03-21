import { NextFunction, Response } from "express";
import { processQuery } from "../lib/database";
import jwt from "jsonwebtoken";
import config from "../lib/config";
import IRequest from "../interfaces/IRequest";
import IUser from "../interfaces/IUser";

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
    const user = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`  FROM `users` WHERE `id` = ?",
      [vToken.id],
    );

    if (!user[0]) {
      return res.json({
        invalid_token: true,
        server_error: "user does not exist",
        status: "error",
      });
    }

    req.user = user[0];

    next();
  } catch (e) {
    return res
      .json({ invalid_token: true, server_error: "invalid token", status: "error" })
      .status(401);
  }
}

export default useAuth;
