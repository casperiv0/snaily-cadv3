import { Deputy } from "types/Deputy";

export interface IEmsFd {
  type: "GET_DEPUTIES" | "DELETE_DEPUTY" | "CREATE_DEPUTY";
  deputies: Deputy[];
}

export interface SetEmsFdStatus {
  type: "SET_EMS_FD_STATUS";
  deputy: Deputy;
}

export type Actions = IEmsFd;
