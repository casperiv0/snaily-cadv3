import { Bleet } from "types/Bleet";

export interface IBleeter {
  type: "GET_BLEETS" | "CREATE_BLEET";
  bleets: Bleet[];
}

export interface GetBleetById {
  type: "GET_BLEET_BY_ID";
  bleet: Bleet;
}

export interface UpdateBleetById {
  type: "UPDATE_BLEET_BY_ID";
  bleet: Bleet;
}

export type Actions = IBleeter | UpdateBleetById | GetBleetById;
