import { Cad } from "./Cad";
import { Call } from "./Call";
import { Citizen } from "./Citizen";
import { TruckLog } from "./TruckLog";
import { User } from "./User";
import { Value } from "./Value";
import { Vehicle } from "./Vehicle";
import { Weapon } from "./Weapon";

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
    vehicles: Vehicle[];
    weapons: Weapon[];
  };
  calls: {
    calls: Call[];
  };
  truckLogs: {
    logs: TruckLog[];
  };
  values: {
    genders: Value[];
    "legal-statuses": Value[];
    "call-types": Value[];
    ethnicities: Value[];
    weapons: Value[];
    vehicles: Value[];
    departments: Value[];
    error: Nullable<string>;
    value: Nullable<Value>;
    loading: boolean;
  };
}
