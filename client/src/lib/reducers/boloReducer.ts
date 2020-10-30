import Bolo from "../../interfaces/Bolo";
import { CREATE_BOLO, CREATE_BOLO_ERROR, DELETE_BOLO, GET_BOLOS } from "../types";

const initState = {
  bolos: [],
  error: null,
};

type Actions =
  | {
      type: typeof GET_BOLOS;
      bolos: Bolo[];
    }
  | {
      type: typeof CREATE_BOLO_ERROR;
      error: string;
    }
  | {
      type: typeof CREATE_BOLO;
      bolos: Bolo[];
    }
  | {
      type: typeof DELETE_BOLO;
      bolos: Bolo[];
    };

export default function boloReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BOLOS":
      return {
        ...state,
        bolos: action.bolos,
      };
    case "CREATE_BOLO":
      return {
        ...state,
        bolos: action.bolos,
      };
    case "CREATE_BOLO_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "DELETE_BOLO":
      return {
        ...state,
        bolos: action.bolos,
      };
    default:
      return {
        ...state,
      };
  }
}
