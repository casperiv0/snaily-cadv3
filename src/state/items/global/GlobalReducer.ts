import { State } from "types/State";
import { Actions } from "./GlobalTypes";

const initState: State["global"] = {
  cadInfo: null,
  aop: null,
};

export function GlobalReducer(state = initState, action: Actions): State["global"] {
  switch (action.type) {
    case "UPDATE_CAD_SETTINGS":
    case "GET_CAD_INFO": {
      return {
        ...state,
        cadInfo: action.cadInfo,
        aop: action.cadInfo?.AOP ?? null,
      };
    }
    case "UPDATE_AOP": {
      return {
        ...state,
        aop: action.aop,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
