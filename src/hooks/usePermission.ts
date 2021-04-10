import { IRequest } from "../interfaces/IRequest";
import { User } from "types/User";
import { AnError, RanksArr, Ranks } from "@lib/consts";
import { processQuery } from "../lib/database";
import { logger } from "../lib/logger";
import { Perm } from "types/Perm";
import { IError } from "types/IError";

// rank, leo, ems_fd, dispatch, tow
type UserPermsArr = [Ranks, Perm, Perm, Perm, Perm, Perm];
type Permissions =
  | "admin"
  | "owner"
  | "moderator"
  | "leo"
  | "ems_fd"
  | "dispatch"
  | "tow"
  | "supervisor";

export const usePermission = async (req: IRequest, perms: Permissions[]): Promise<IError> => {
  try {
    const [user] = await processQuery<User>(
      "SELECT `rank`, `leo`, `dispatch`, `tow`, `ems_fd`, `supervisor` FROM `users` WHERE `id` = ?",
      [req.userId],
    );

    const userPerms: UserPermsArr = [
      user.rank,
      user.leo,
      user.ems_fd,
      user.dispatch,
      user.tow,
      user.supervisor,
    ];

    if (!user) {
      return Promise.reject({
        code: 401,
        msg: "user was not found",
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
          if (!RanksArr.includes(user.rank)) {
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
      return Promise.reject({
        code: 401,
        msg: "Forbidden",
        required_permissions: perms.map((p) => `'${p}'`).join(" or "),
      });
    }
    invalidPerms.length = 0;

    return Promise.resolve({ code: 200, msg: "Permission accepted" });
  } catch (e) {
    logger.error("USE_PERMISSION", e);

    return Promise.reject({
      msg: AnError,
      code: 500,
    });
  }
};
