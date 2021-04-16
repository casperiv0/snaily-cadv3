import { State } from "types/State";
import { Actions } from "./OfficerTypes";

const initState: State["officers"] = {
  search: null,
  activeOfficer: null,
  officers: [],
  logs: [],
  names: [],
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
    case "SEARCH_NAMES": {
      return {
        ...state,
        names: action.names,
      };
    }
    case "GET_MY_OFFICER_LOGS": {
      return {
        ...state,
        logs: action.logs,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
