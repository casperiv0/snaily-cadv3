import Call from "../../interfaces/Call";
import TowCall from "../../interfaces/TowCall";
import {
  GET_911_CALLS,
  UPDATE_911_CALL,
  END_911_CALL,
  CREATE_TOW_CALL,
} from "../types";

const initState = {
  calls_911: [],
  tow_calls: [],
};

type Actions =
  | {
      type: typeof GET_911_CALLS;
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
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_911_CALLS":
      return {
        ...state,
        calls_911: action.calls,
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
    default:
      return {
        ...state,
      };
  }
}
