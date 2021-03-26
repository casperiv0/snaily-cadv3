import { NextFunction, Response } from "express";
import IRequest from "../interfaces/IRequest";
import IUser, { Perm } from "../interfaces/IUser";
import { RanksArr, RanksType } from "../lib/constants";
import { processQuery } from "../lib/database";
import Logger from "../lib/Logger";

// rank, leo, ems_fd, dispatch, tow
type UserPermsArr = [RanksType, Perm, Perm, Perm, Perm, Perm];
type Permissions = RanksType | "leo" | "ems_fd" | "dispatch" | "tow" | "supervisor";

const usePermission = (perms: Permissions[]) => async (
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const user = await processQuery<IUser>(
      "SELECT `rank`, `leo`, `dispatch`, `tow`, `ems_fd`, `supervisor` FROM `users` WHERE `id` = ?",
      [req.userId],
    );

    const userPerms: UserPermsArr = [
      user[0].rank,
      user[0].leo,
      user[0].ems_fd,
      user[0].dispatch,
      user[0].tow,
      user[0].supervisor,
    ];

    if (!user[0]) {
      return res.json({
        error: "user was not found",
        status: "error",
      });
    }

    let invalid = true;
    const invalidPerms: Permissions[] = [];

    perms.forEach((perm: Permissions) => {
      switch (perm) {
        case "leo": {
          if (userPerms[1] === "0") {
            // 1 = leo
            invalidPerms.push("leo");
          } else {
            invalid = false;
          }
          break;
        }
        case "ems_fd": {
          if (userPerms[2] === "0") {
            // 2 = ems_fd
            invalidPerms.push("ems_fd");
          } else {
            invalid = false;
          }
          break;
        }
        case "dispatch": {
          if (userPerms[3] === "0") {
            // 3 = dispatch
            invalidPerms.push("dispatch");
          } else {
            invalid = false;
          }
          break;
        }
        case "tow": {
          if (userPerms[4] === "0") {
            // 4 = tow
            invalidPerms.push("tow");
          } else {
            invalid = false;
          }
          break;
        }
        case "supervisor": {
          if (userPerms[5] === "0") {
            invalidPerms.push("supervisor");
          } else {
            invalid = false;
          }
          break;
        }
        default: {
          // 0 = rank | defaults to 'default'
          if (!RanksArr.includes(user[0].rank)) {
            invalid = true;
          } else {
            invalid = false;
          }
          break;
        }
      }
    });

    if (invalidPerms.length === perms.length) {
      invalid = true;
    }

    if (invalid) {
      return res.json({
        error: "Forbidden",
        needed_permissions: perms.map((p) => `'${p}'`).join(" or "),
        status: "error",
      });
    }
    invalidPerms.length = 0;

    next();
  } catch (e) {
    Logger.error("USE_PERMISSION", e);
    return res.json({
      error: "An error occurred checking the user's permission",
      status: "error",
    });
  }
};

export default usePermission;
