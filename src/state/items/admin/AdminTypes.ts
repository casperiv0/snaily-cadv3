import { Citizen } from "types/Citizen";
import { Code10 } from "types/Code10";
import { ExpungementRequest } from "types/ExpungementRequest";
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
  type: "GET_EXPUNGEMENT_REQUESTS" | "UPDATE_EXPUNGEMENT_REQUEST";
  expungementRequests: ExpungementRequest[];
}

export interface IMembers {
  type: "GET_MEMBERS";
  members: User[];
}

export interface GetMemberById {
  type: "GET_MEMBER_BY_ID";
  member: User;
}

export type Actions =
  | I10Codes
  | IPenalCodes
  | ICitizens
  | IExpungementRequests
  | IMembers
  | GetMemberById;
