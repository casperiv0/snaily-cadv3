import { State } from "types/State";
import { Actions } from "./CallTypes";

const initState: State["calls"] = {
  calls: [],
};

export function GlobalReducer(state = initState, action: Actions): State["calls"] {
  switch (action.type) {
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
