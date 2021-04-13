import { State } from "types/State";
import { Actions } from "./OfficerTypes";

const initState: State["officers"] = {
  search: null,
  activeOfficer: null,
};

export function OfficerReducer(state = initState, action: Actions): State["officers"] {
  switch (action.type) {
    case "PLATE_SEARCH":
    case "WEAPON_SEARCH":
    case "NAME_SEARCH": {
      return {
        ...state,
        search: { type: action.searchType, ...action.search },
      };
    }
    case "SET_STATUS":
    case "GET_ACTIVE_OFFICER": {
      return {
        ...state,
        activeOfficer: action.activeOfficer,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
