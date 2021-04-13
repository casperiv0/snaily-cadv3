import { State } from "types/State";
import { Actions } from "./OfficerTypes";

const initState: State["dispatch"] = {
  officers: [],
  ems_fd: [],
  search: null,
  steamIds: [],
};

export function OfficerReducer(state = initState, action: Actions): State["dispatch"] {
  switch (action.type) {
    case "PLATE_SEARCH":
    case "WEAPON_SEARCH":
    case "NAME_SEARCH": {
      return {
        ...state,
        search: { type: action.searchType, ...action.search },
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
