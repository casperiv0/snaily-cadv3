import { State } from "types/State";
import { Actions } from "./AuthTypes";

const initState: State["auth"] = {
  isAuth: false,
  user: null,
};

export function AuthReducer(state = initState, action: Actions): State["auth"] {
  switch (action.type) {
    case "VERIFY_AUTH":
    case "AUTHENTICATE": {
      return {
        ...state,
        user: action.user,
        isAuth: action.isAuth,
      };
    }
    case "UNLINK_STEAM": {
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              steam_id: "",
            }
          : null,
      };
    }
    case "UPDATE_USERNAME": {
      return {
        ...state,
        user: action.user ?? null,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
