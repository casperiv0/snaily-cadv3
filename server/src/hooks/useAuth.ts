import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import IRequest from "../interfaces/IRequest";
import IUser from "../interfaces/IUser";
import { processQuery } from "../lib/database";

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
      "SELECT * FROM `users` WHERE `username` = ?",
      [vToken.id]
    );

    req.user = user;
    
    next();
  } catch (e) {
    res.json({ server_error: "invalid token", status: "error" }).status(401);
    return;
  }
}

export default useAuth;
