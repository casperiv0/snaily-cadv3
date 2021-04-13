import { Officer } from "types/Officer";

export interface Search {
  type: "PLATE_SEARCH" | "NAME_SEARCH" | "WEAPON_SEARCH";
  search: any;
  searchType: "plate" | "weapon" | "name";
}

export interface IOfficer {
  type: "GET_ACTIVE_OFFICER" | "SET_STATUS";
  activeOfficer: Officer;
}

export type Actions = Search | IOfficer;
