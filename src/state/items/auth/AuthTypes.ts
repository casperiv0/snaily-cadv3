import { Nullable } from "types/State";
import { User } from "types/User";

export interface Authenticate {
  type: "AUTHENTICATE";
  user: Nullable<User>;
  isAuth: boolean;
}

export interface VerifyAuth {
  type: "VERIFY_AUTH";
  user: Nullable<User>;
  isAuth: boolean;
}

export interface UpdatePassword {
  type: "UPDATE_PASSWORD";
}

export interface UpdateUsername {
  type: "UPDATE_USERNAME";
  user: Nullable<User>;
}

export interface UnlinkSteam {
  type: "UNLINK_STEAM";
}

export type Actions = Authenticate | VerifyAuth | UnlinkSteam | UpdateUsername;
