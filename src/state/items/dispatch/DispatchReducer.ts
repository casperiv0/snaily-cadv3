import { State } from "types/State";
import { Actions } from "./DispatchTypes";

const initState: State["dispatch"] = {
  officers: [],
  ems_fd: [],
  search: null,
  steamIds: [],
};

export function DispatchReducer(state = initState, action: Actions): State["dispatch"] {
  switch (action.type) {
    case "GET_ACTIVE_UNITS": {
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
      };
    }
    case "ADDRESS_SEARCH": {
      return {
        ...state,
        search: action.search,
      };
    }
    case "GET_STEAM_IDS": {
      return {
        ...state,
        steamIds: action.steamIds,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
