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
