import { Citizen } from "types/Citizen";
import { Code10 } from "types/Code10";
import { Deputy } from "types/Deputy";
import { ExpungementRequest } from "types/ExpungementRequest";
import { Officer } from "types/Officer";
import { PenalCode } from "types/PenalCode";
import { User } from "types/User";

export interface I10Codes {
  type: "GET_10_CODES" | "DELETE_10_CODE" | "UPDATE_10_CODE";
  codes: Code10[];
}

export interface IPenalCodes {
  type: "GET_PENAL_CODES" | "DELETE_PENAL_CODE" | "UPDATE_PENAL_CODE";
  penalCodes: PenalCode[];
}

export interface ICitizens {
  type: "GET_CITIZENS" | "DELETE_CITIZEN";
  citizens: Citizen[];
}

export interface IExpungementRequests {
  type: "GET_EXPUNGEMENT_REQUESTS_ADMIN" | "UPDATE_EXPUNGEMENT_REQUEST";
  expungementRequests: ExpungementRequest[];
}

export interface IMembers {
  type: "GET_MEMBERS" | "ACCEPT_MEMBER" | "DECLINE_MEMBER";
  members: User[];
}

export interface GetMemberById {
  type: "GET_MEMBER_BY_ID";
  member: User;
}

export interface IUnits {
  type: "GET_ALL_UNITS";
  ems_fd: Deputy[];
  officers: Officer[];
}

export interface IUnit {
  type: "GET_UNIT_BY_ID";
  unit: Officer | Deputy;
}

export interface UpdateMemberById {
  type: "UPDATE_MEMBER_PERMS";
  member: User;
}

export interface GetTempPassword {
  type: "GET_TEMP_PASSWORD";
  tempPassword: string;
}

export type Actions =
  | I10Codes
  | IPenalCodes
  | ICitizens
  | IExpungementRequests
  | IMembers
  | GetMemberById
  | IUnits
  | IUnit
  | UpdateMemberById
  | GetTempPassword;
