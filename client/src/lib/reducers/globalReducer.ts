import { UPDATE_AOP, GET_AOP } from "../types";

const initState = {
  aop: null,
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
    };

export default function (state = initState, action: Actions) {
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
    default:
      return {
        ...state,
      };
  }
}
