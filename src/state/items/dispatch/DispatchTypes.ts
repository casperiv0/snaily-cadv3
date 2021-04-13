import { Deputy } from "types/Deputy";
import { Officer } from "types/Officer";
import { User } from "types/User";

export interface GetActiveUnits {
  type: "GET_ACTIVE_UNITS";
  officers: Officer[];
  ems_fd: Deputy[];
}

export interface AddressSearch {
  type: "ADDRESS_SEARCH";
  search: any;
}

export interface GetSteamIds {
  type: "GET_STEAM_IDS";
  steamIds: Partial<User>[];
}

export type Actions = GetActiveUnits | GetSteamIds | AddressSearch;
