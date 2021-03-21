import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { ADDRESS_SEARCH, GET_ACTIVE_UNITS } from "../types";

const initState: State["dispatch"] = {
  officers: [],
  ems_fd: [],
  search: null,
  steam_ids: [],
};

type Actions =
  | {
      type: typeof GET_ACTIVE_UNITS;
      officers: Officer[];
      ems_fd: Deputy[];
    }
  | {
      type: typeof ADDRESS_SEARCH;
      search: object;
    }
  | {
      type: "GET_STEAM_IDS";
      steam_ids: Partial<User>[];
    };

export default function dispatchReducer(state = initState, action: Actions): State["dispatch"] {
  switch (action.type) {
    case "GET_ACTIVE_UNITS":
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
      };
    case "ADDRESS_SEARCH":
      return {
        ...state,
        search: action.search,
      };
    case "GET_STEAM_IDS":
      return {
        ...state,
        steam_ids: action.steam_ids,
      };
    default:
      return {
        ...state,
      };
  }
}
