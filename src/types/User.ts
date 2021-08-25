import { Ranks } from "lib/consts";
import { Perm } from "./Perm";

export interface User {
  id: string;
  username: string;
  rank: Ranks;
  edit_passwords: Perm;
  leo: Perm;
  supervisor: Perm;
  ems_fd: Perm;
  dispatch: Perm;
  tow: Perm;
  banned: Perm;
  ban_reason: string;
  whitelist_status: "pending" | "accepted";
  steam_id: string;
  avatar_url: string;

  /**
   * only available for /api/auth/login!
   */
  password: string;
}
