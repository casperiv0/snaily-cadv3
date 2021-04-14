import { Officer, OfficerLog } from "types/Officer";

export interface Search {
  type: "PLATE_SEARCH" | "NAME_SEARCH" | "WEAPON_SEARCH";
  search: any;
  searchType: "plate" | "weapon" | "name";
}

export interface IOfficer {
  type: "GET_ACTIVE_OFFICER" | "SET_STATUS";
  activeOfficer: Officer;
}

export interface IOfficers {
  type: "GET_MY_OFFICERS" | "DELETE_OFFICER" | "CREATE_OFFICER";
  officers: Officer[];
}

export interface GetOfficerLogs {
  type: "GET_MY_OFFICER_LOGS";
  logs: OfficerLog[];
}

export interface SearchNames {
  type: "SEARCH_NAMES";
  names: string[];
}

export type Actions = Search | IOfficer | IOfficers | SearchNames | GetOfficerLogs;
