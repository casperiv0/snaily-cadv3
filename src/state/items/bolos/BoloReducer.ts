import { State } from "types/State";
import { Actions } from "./BoloTypes";

const initState: State["bolos"] = {
  bolos: [],
};

export function BoloReducer(state = initState, action: Actions): State["bolos"] {
  switch (action.type) {
    case "GET_BOLOS":
    case "UPDATE_BOLOS":
    case "DELETE_BOLO":
    case "CREATE_BOLO": {
      return {
        ...state,
        bolos: action.bolos,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
