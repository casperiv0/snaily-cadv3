import Citizen from "../../interfaces/Citizen";
import {
  GET_CITIZENS,
  CREATE_CITIZEN_ERROR,
  GET_CITIZEN_BY_ID,
} from "../types";

const initState = {
  error: null,
  citizens: [],
};

type Actions =
  | {
      type: typeof GET_CITIZENS;
      citizens: Citizen[];
    }
  | {
      type: typeof CREATE_CITIZEN_ERROR;
      error: string;
    }
  | {
      type: typeof GET_CITIZEN_BY_ID;
      citizen: Citizen;
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    case "CREATE_CITIZEN_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "GET_CITIZEN_BY_ID":
      return {
        ...state,
        citizen: action.citizen,
      };
    default:
      return {
        ...state,
      };
  }
}
