import State from "../../interfaces/State";
import { AUTHENTICATE, SET_LOADING, LOGOUT, DELETE_ACCOUNT, UNLINK_STEAM } from "../types";

const initState: State["auth"] = {
  user: null,
  loading: true,
  isAuth: false,
};

type Actions =
  | {
      type: typeof AUTHENTICATE;
      user: object;
      isAuth: boolean;
    }
  | {
      type: typeof SET_LOADING;
      loading: boolean;
    }
  | {
      type: typeof LOGOUT | typeof DELETE_ACCOUNT;
    }
  | {
      type: typeof UNLINK_STEAM;
    };

export default function authReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "AUTHENTICATE":
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "DELETE_ACCOUNT":
    case "LOGOUT":
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
        isAuth: false,
      };
    case "UNLINK_STEAM":
      return {
        ...state,
        user: {
          ...state.user,
          steam_id: null,
        },
      };
    default:
      return {
        ...state,
      };
  }
}
