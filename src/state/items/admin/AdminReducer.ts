import { State } from "types/State";
import { Actions } from "./AdminTypes";

const initState: State["admin"] = {
  codes: [],
  penalCodes: [],
};

export function AdminReducer(state = initState, action: Actions): State["admin"] {
  switch (action.type) {
    case "DELETE_10_CODE":
    case "UPDATE_10_CODE":
    case "GET_10_CODES": {
      return {
        ...state,
        codes: action.codes,
      };
    }
    case "DELETE_PENAL_CODE":
    case "UPDATE_PENAL_CODE":
    case "GET_PENAL_CODES": {
      return {
        ...state,
        penalCodes: action.penalCodes,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
