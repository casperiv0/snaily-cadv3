import { State } from "types/State";
import { Actions } from "./OfficerTypes";

const initState: State["officers"] = {
  search: null,
  activeOfficer: null,
  officers: [],
  logs: [],
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
    case "DELETE_OFFICER":
    case "CREATE_OFFICER":
    case "GET_MY_OFFICERS": {
      return {
        ...state,
        officers: action.officers,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
