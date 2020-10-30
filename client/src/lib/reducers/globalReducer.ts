import { UPDATE_AOP, GET_AOP, SET_MESSAGE } from "../types";

const initState = {
  aop: null,
  message: null,
  cadInfo: {},
};

type Actions =
  | {
      type: typeof UPDATE_AOP;
      aop: string;
    }
  | {
      type: typeof GET_AOP;
      aop: string;
    }
  | {
      type: typeof SET_MESSAGE;
      message: string;
    };

export default function globalReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_AOP":
      return {
        ...state,
        aop: action.aop,
      };
    case "UPDATE_AOP":
      return {
        ...state,
        aop: action.aop,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.message,
      };
    default:
      return {
        ...state,
      };
  }
}
