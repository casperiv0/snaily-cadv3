import { State } from "types/State";
import { Actions } from "./CallTypes";

const initState: State["calls"] = {
  calls: [],
};

export function CallReducer(state = initState, action: Actions): State["calls"] {
  switch (action.type) {
    case "GET_CALLS":
    case "UPDATE_CALL":
    case "CREATE_CALL": {
      return {
        ...state,
        calls: action.calls,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
