import { Cad } from "./Cad";
import { User } from "./User";

export type Nullable<T> = T | null;

export interface State {
  auth: {
    isAuth: boolean;
    user: Nullable<User>;
    loading: boolean;
  };
  global: {
    aop: Nullable<string>;
    cadInfo: Nullable<Cad>;
  };
}
