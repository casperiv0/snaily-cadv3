import { AUTHENTICATE, AUTH_ERROR, SET_LOADING, LOGOUT, DELETE_ACCOUNT } from "../types";

const initState = {
  user: null,
  loading: true,
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
      error: string | null;
    }
  | {
      type: typeof SET_LOADING;
      loading: boolean;
    }
  | {
      type: typeof LOGOUT;
    }
  | {
      type: typeof DELETE_ACCOUNT;
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
        ...state,
        loading: action.loading,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
        isAuth: false,
      };
    case "DELETE_ACCOUNT":
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
        isAuth: false,
      };
    default:
      return {
        ...state,
      };
  }
}
