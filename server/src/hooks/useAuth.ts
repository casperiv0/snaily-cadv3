import { NextFunction, Response } from "express";
import { processQuery } from "../lib/database";
import jwt from "jsonwebtoken";
import config from "../../config";
import IRequest from "../interfaces/IRequest";
import IUser from "../interfaces/IUser";

async function useAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies.__token;
  const secret = config.jwtSecret;

  if (!token) {
    res.json({ server_error: "Invalid Token", status: "error" }).status(401);
    return;
  }

  try {
    const vToken = jwt.verify(token, secret) as IUser;
    const user = await processQuery(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `dispatch_status`  FROM `users` WHERE `id` = ?",
      [vToken.id]
    );

    if (!user[0]) {
      res.json({
        server_error: "user does not exist",
        status: "error",
      });
      return;
    }

    req.user = user[0];

    next();
  } catch (e) {
    res.json({ server_error: "invalid token", status: "error" }).status(401);
    return;
  }
}

export default useAuth;
