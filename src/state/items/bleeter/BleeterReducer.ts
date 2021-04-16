import { State } from "types/State";
import { Actions } from "./BleeterTypes";

const initState: State["bleeter"] = {
  bleet: null,
  bleets: [],
};

export function BleeterReducer(state = initState, action: Actions): State["bleeter"] {
  switch (action.type) {
    case "GET_BLEETS":
    case "CREATE_BLEET": {
      return {
        ...state,
        bleets: action.bleets,
      };
    }
    case "GET_BLEET_BY_ID":
    case "UPDATE_BLEET_BY_ID": {
      return {
        ...state,
        bleet: action.bleet,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
