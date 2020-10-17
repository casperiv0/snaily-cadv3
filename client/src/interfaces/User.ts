interface User {
  id: string;
  username: string;
  password: string;
  rank: "owner" | "admin" | "moderator" | "user";
  leo: string;
  ems_fd: string;
  dispatch: string;
  tow: string;
  banned: string;
  ban_reason: string;
  whitelist_status: "pending" | "accepted";
}

export default User;
