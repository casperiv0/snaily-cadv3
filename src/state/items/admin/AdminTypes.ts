import { Code10 } from "types/Code10";
import { PenalCode } from "types/PenalCode";

export interface I10Codes {
  type: "GET_10_CODES" | "DELETE_10_CODE" | "UPDATE_10_CODE";
  codes: Code10[];
}

export interface IPenalCodes {
  type: "GET_PENAL_CODES" | "DELETE_PENAL_CODE" | "UPDATE_PENAL_CODE";
  penalCodes: PenalCode[];
}

export type Actions = I10Codes | IPenalCodes;
