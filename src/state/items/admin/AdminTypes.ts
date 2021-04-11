import { Code10 } from "types/Code10";

export interface I10Codes {
  type: "GET_10_CODES" | "DELETE_10_CODE" | "UPDATE_10_CODE";
  codes: Code10[];
}

export type Actions = I10Codes;
