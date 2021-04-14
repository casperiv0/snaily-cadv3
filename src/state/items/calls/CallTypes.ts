import { Call } from "types/Call";

export interface GetCalls {
  type: "GET_CALLS";
  calls: Call[];
}

export interface CreateCall {
  type: "CREATE_CALL";
  calls: Call[];
}

export interface UpdateCall {
  type: "UPDATE_CALL";
  calls: Call[];
}

export type CallTypes = "911" | "tow" | "taxi";
export type Actions = CreateCall | GetCalls | UpdateCall;
