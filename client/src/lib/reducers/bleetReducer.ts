import Bleet from "../../interfaces/Bleet";
import State from "../../interfaces/State";
import {
  GET_BLEETS,
  SET_LOADING_BLEETS,
  GET_BLEET_BY_ID,
  CREATE_BLEET,
  UPDATE_BLEET,
} from "../types";

const initState: State["bleets"] = {
  bleets: [],
  bleet: null,
  error: null,
  loading: true,
};

type Actions =
  | {
      type: typeof GET_BLEETS | typeof CREATE_BLEET;
      bleets: Bleet[];
    }
  | {
      type: typeof SET_LOADING_BLEETS;
      loading: boolean;
    }
  | {
      type: typeof GET_BLEET_BY_ID | typeof UPDATE_BLEET;
      bleet: Bleet;
    };

export default function bleetReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BLEETS":
    case "CREATE_BLEET":
      return {
        ...state,
        bleets: action.bleets,
      };
    case "SET_LOADING_BLEETS":
      return {
        ...state,
        loading: action.loading,
      };
    case "GET_BLEET_BY_ID":
    case "UPDATE_BLEET":
      return {
        ...state,
        bleet: action.bleet,
      };
    default:
      return {
        ...state,
      };
  }
}
