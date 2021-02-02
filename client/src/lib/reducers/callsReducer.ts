import Call from "../../interfaces/Call";
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

const initState = {
  calls_911: [],
  tow_calls: [],
  taxi_calls: [],
};

type Actions =
  | {
      type: typeof GET_911_CALLS;
      calls: Call[];
    }
  | {
      type: typeof CREATE_911_CALL;
      calls: Call[];
    }
  | {
      type: typeof UPDATE_911_CALL;
      calls: Call[];
    }
  | {
      type: typeof END_911_CALL;
      calls: Call[];
    }
  | {
      type: typeof CREATE_TOW_CALL;
      calls: TowCall[];
    }
  | {
      type: typeof GET_TOW_CALLS;
      calls: TowCall[];
    }
  | {
      type: typeof END_TOW_CALL;
      calls: TowCall[];
    }
  | {
      type: typeof GET_TAXI_CALLS;
      calls: TowCall[];
    }
  | {
      type: typeof END_TAXI_CALL;
      calls: TowCall[];
    };

export default function callsReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_911_CALLS":
      return {
        ...state,
        calls_911: action.calls,
      };
    case "CREATE_911_CALL":
      return {
        ...state,
        calls: action.calls,
      };
    case "UPDATE_911_CALL":
      return {
        ...state,
        calls_911: action.calls,
      };
    case "END_911_CALL":
      return {
        ...state,
        calls_911: action.calls,
      };
    case "CREATE_TOW_CALL":
      return {
        ...state,
        tow_calls: action.calls,
      };
    case "GET_TOW_CALLS":
      return {
        ...state,
        tow_calls: action.calls,
      };
    case "END_TOW_CALL":
      return {
        ...state,
        tow_calls: action.calls,
      };
    case "GET_TAXI_CALLS": {
      return {
        ...state,
        taxi_calls: action.calls,
      };
    }
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
