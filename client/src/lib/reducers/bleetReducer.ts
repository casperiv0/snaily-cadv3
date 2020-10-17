import Bleet from "../../interfaces/Bleet";
import { GET_BLEETS, SET_LOADING_BLEETS, GET_BLEET_BY_ID } from "../types";

const initState = {
  bleets: [],
  bleet: {},
  loading: true,
  error: null,
};

type Actions =
  | {
      type: typeof GET_BLEETS;
      bleets: Bleet[];
    }
  | {
      type: typeof SET_LOADING_BLEETS;
      loading: boolean;
    }
  | {
      type: typeof GET_BLEET_BY_ID;
      bleet: Bleet;
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BLEETS":
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
