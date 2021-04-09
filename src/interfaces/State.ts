import { Cad } from "./Cad";
import { Call } from "./Call";
import { Citizen } from "./Citizen";
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
  citizen: {
    citizens: Citizen[];
    citizen: Nullable<Citizen>;
    loading: boolean;
  };
  calls: {
    calls: Call[];
  };
}
