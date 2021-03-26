export const RanksArr = ["owner", "admin", "moderator"];
export type RanksType = "owner" | "admin" | "moderator" | "user";

export const enum Ranks {
  owner = "owner",
  admin = "admin",
  moderator = "moderator",
  user = "user",
}

export const enum Whitelist {
  accepted = "accepted",
  pending = "pending",
  declined = "declined",
}

export const SupportedFileTypes = ["image/png", "image/gif", "image/jpeg", "image/svg+xml"];

/* 2hours */
export const CookieExpiresIn = 60 * 60 * 2 * 1000;

export const WhitelistedChars = /[a-z]|[0-9]|\s/;

export const SaveUserQueryData =
  "`id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`";
