import { CourtResult } from "@actions/court/CourtTypes";
import { Name } from "@actions/officer/OfficerTypes";
import { Bleet } from "./Bleet";
import { Bolo } from "./Bolo";
import { Cad } from "./Cad";
import { Call } from "./Call";
import { Citizen } from "./Citizen";
import { Code10 } from "./Code10";
import { Company, CompanyPost } from "./Company";
import { Deputy } from "./Deputy";
import { ExpungementRequest } from "./ExpungementRequest";
import { MedicalRecord } from "./MedicalRecord";
import { Officer, OfficerLog } from "./Officer";
import { PenalCode } from "./PenalCode";
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
  };
  admin: {
    codes: Code10[];
    penalCodes: PenalCode[];
    citizens: Citizen[];
    expungementRequests: ExpungementRequest[];
    members: User[];
    member: Nullable<User>;
    tempPassword: Nullable<string>;

    officers: Officer[];
    ems_fd: Deputy[];
    unit:
      | null
      | ((Officer | Deputy) & {
          /**
           * Only available when gotten from admin & when an officer
           */
          logs?: OfficerLog[];
        });
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
    medicalRecords: MedicalRecord[];
    companies: Company[];
  };
  calls: {
    calls: Call[];
  };
  companies: {
    companies: Company[];
    company: Nullable<Company>;
    posts: CompanyPost[];
    employees: Citizen[];
    vehicles: Vehicle[];
    error: Nullable<string>;
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
  bleeter: {
    bleets: Bleet[];
    bleet: Nullable<Bleet>;
  };
  court: {
    expungementRequests: ExpungementRequest[];
    courtResult: Nullable<CourtResult>;
  };
  bolos: {
    bolos: Bolo[];
  };
  dispatch: {
    officers: Officer[];
    ems_fd: Deputy[];
    search: Nullable<any>;
    steamIds: Partial<User>[];
  };
  officers: {
    officers: Officer[];
    logs: OfficerLog[];
    search: Nullable<any>;
    activeOfficer: Nullable<Officer>;
    names: Name[];
  };
  ems_fd: {
    activeDeputy: Nullable<Deputy>;
    deputies: Deputy[];
    medicalRecords: MedicalRecord[];
  };
}
