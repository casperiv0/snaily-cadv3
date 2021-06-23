export const Auth = {
  // 2 hours
  CookieExpires: 60 * 60 * 1000 * 2,
};

export const RanksArr = ["owner", "admin", "moderator"];
export enum Ranks {
  Owner = "owner",
  Admin = "admin",
  Mod = "moderator",
  User = "user",
}

export enum Whitelist {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined",
}

export const AnError = {
  error: "An unexpected error has occurred, please let your CAD owner know!",
  status: "error",
};

export const SupportedFileTypes = ["image/png", "image/gif", "image/jpeg", "image/svg+xml"];

export const SaveUserDataArr = [
  "id",
  "username",
  "rank",
  "leo",
  "ems_fd",
  "dispatch",
  "tow",
  "banned",
  "ban_reason",
  "whitelist_status",
  "steam_id",
  "avatar_url",
  "supervisor",
];

export const features = ["bleeter", "tow", "taxi", "courthouse", "truck-logs", "company"];
