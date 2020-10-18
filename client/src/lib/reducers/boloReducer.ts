import Bolo from "../../interfaces/Bolo";
import { GET_BOLOS } from "../types";

const initState = {
  bolos: [],
};

type Actions = {
  type: typeof GET_BOLOS;
  bolos: Bolo[];
};

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BOLOS":
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
