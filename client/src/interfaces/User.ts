export type Perm = "1" | "0";

interface User {
  id: string;
  username: string;
  password: string;
  rank: "owner" | "admin" | "moderator" | "user";
  leo: Perm;
  ems_fd: Perm;
  dispatch: Perm;
  tow: Perm;
  banned: Perm;
  ban_reason: string;
  whitelist_status: "pending" | "accepted";
}

export default User;
