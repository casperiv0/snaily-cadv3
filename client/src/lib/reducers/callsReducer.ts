import Call from "../../interfaces/Call";
import { GET_911_CALLS } from "../types";

const initState = {
  calls: [],
};

type Actions = {
  type: typeof GET_911_CALLS;
  calls: Call[];
};

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_911_CALLS":
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
