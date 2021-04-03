import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import TowCall from "../../interfaces/TowCall";
import {
  GET_911_CALLS,
  UPDATE_911_CALL,
  END_911_CALL,
  CREATE_TOW_CALL,
  GET_TOW_CALLS,
  END_TOW_CALL,
  CREATE_911_CALL,
  GET_TAXI_CALLS,
  END_TAXI_CALL,
} from "../types";

const initState: State["calls"] = {
  calls_911: [],
  tow_calls: [],
  taxi_calls: [],
};

type Actions =
  | {
      type:
        | typeof GET_911_CALLS
        | typeof CREATE_911_CALL
        | typeof UPDATE_911_CALL
        | typeof END_911_CALL;
      calls: Call[];
    }
  | {
      type: typeof CREATE_TOW_CALL | typeof GET_TOW_CALLS | typeof END_TOW_CALL;
      calls: TowCall[];
    }
  | {
      type: typeof GET_TAXI_CALLS | typeof END_TAXI_CALL;
      calls: TowCall[];
    };

export default function callsReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_911_CALLS":
    case "UPDATE_911_CALL":
    case "CREATE_911_CALL":
    case "END_911_CALL":
      return {
        ...state,
        calls_911: action.calls,
      };
    case "CREATE_TOW_CALL":
    case "GET_TOW_CALLS":
    case "END_TOW_CALL":
      return {
        ...state,
        tow_calls: action.calls,
      };

    case "GET_TAXI_CALLS":
    case "END_TAXI_CALL":
      return {
        ...state,
        taxi_calls: action.calls,
      };
    default:
      return {
        ...state,
      };
  }
}
