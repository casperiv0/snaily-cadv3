import { User } from "types/User";

export interface Authenticate {
  type: "AUTHENTICATE";
  user: User | null;
  isAuth: boolean;
}

export interface VerifyAuth {
  type: "VERIFY_AUTH";
  user: User | null;
  isAuth: boolean;
}

export interface UpdatePassword {
  type: "UPDATE_PASSWORD";
}

export type Actions = Authenticate | VerifyAuth;
