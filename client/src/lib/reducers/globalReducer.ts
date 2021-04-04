import CadInfo from "../../interfaces/CadInfo";
import State from "../../interfaces/State";
import { UPDATE_AOP, GET_AOP, GET_CAD_INFO } from "../types";

const initState: State["global"] = {
  aop: null,
  cadInfo: null,
};

type Actions =
  | {
      type: typeof UPDATE_AOP | typeof GET_AOP;
      aop: string;
    }
  | {
      type: typeof GET_CAD_INFO;
      cadInfo: CadInfo | null;
    };

export default function globalReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_AOP":
    case "UPDATE_AOP":
      return {
        ...state,
        aop: action.aop,
      };
    case "GET_CAD_INFO":
      return {
        ...state,
        cadInfo: action.cadInfo,
      };
    default:
      return {
        ...state,
      };
  }
}
