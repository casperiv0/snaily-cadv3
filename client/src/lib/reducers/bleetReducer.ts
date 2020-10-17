import Bleet from "../../interfaces/Bleet";
import { GET_BLEETS } from "../types";

const initState = {
  bleets: null,
  loading: false,
  error: null,
};

type Actions = {
  type: typeof GET_BLEETS;
  bleets: Bleet[];
};

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BLEETS":
      return {
        ...state,
        bleets: action.bleets,
        error: null,
      };
    default:
      return {
        ...state,
      };
  }
}
