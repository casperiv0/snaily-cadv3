import { State } from "types/State";
import { Actions } from "./AuthTypes";

const initState: State["auth"] = {
  isAuth: false,
  loading: false,
  user: null,
};

export function AuthReducer(state = initState, action: Actions): State["auth"] {
  switch (action.type) {
    case "VERIFY_AUTH":
    case "AUTHENTICATE": {
      return {
        ...state,
        loading: false,
        user: action.user,
        isAuth: action.isAuth,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
