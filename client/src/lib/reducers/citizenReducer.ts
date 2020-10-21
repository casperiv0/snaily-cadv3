import Citizen from "../../interfaces/Citizen";
import { GET_CITIZENS } from "../types";

const initState = {
  error: null,
  citizens: [],
};

type Actions = {
  type: typeof GET_CITIZENS;
  citizens: Citizen[];
};

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    default:
      return {
        ...state,
      };
  }
}
