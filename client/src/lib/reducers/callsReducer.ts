import Call from "../../interfaces/Call";
import { GET_911_CALLS, UPDATE_911_CALL, END_911_CALL } from "../types";

const initState = {
  calls: [],
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
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_911_CALLS":
      return {
        ...state,
        calls: action.calls,
      };
    case "UPDATE_911_CALL":
      return {
        ...state,
        calls: action.calls,
      };
    case "END_911_CALL":
      return {
        ...state,
        calls: action.calls,
      };
    default:
      return {
        ...state,
      };
  }
}
