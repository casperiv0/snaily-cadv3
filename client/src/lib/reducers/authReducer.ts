import { AUTHENTICATE, AUTH_ERROR, SET_LOADING } from "../types";

const initState = {
  user: null,
  loading: false,
  isAuth: false,
  error: null,
};

type Actions =
  | {
      type: typeof AUTHENTICATE;
      user: object;
      isAuth: boolean;
    }
  | {
      type: typeof AUTH_ERROR;
      error: string;
    }
  | {
      type: typeof SET_LOADING;
      loading: boolean;
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "AUTHENTICATE":
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        error: action.error,
        user: null,
        isAuth: false,
      };
    case "SET_LOADING":
      return {
        loading: action.loading,
      };
    default:
      return {
        ...state,
      };
  }
}
