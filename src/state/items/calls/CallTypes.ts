import { Call } from "types/Call";

interface GetCalls {
  type: "GET_911_CALLS" | "GET_TOW_CALLS" | "GET_TAXI_CALLS";
  calls: Call[];
}

export interface CreateCall {
  type: "CREATE_CALL";
  calls: Call[];
}

export type CallTypes = "911" | "tow" | "taxi";
export type Actions = CreateCall | GetCalls;
