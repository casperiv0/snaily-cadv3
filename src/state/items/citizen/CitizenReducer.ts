import { State } from "types/State";
import { Actions } from "./CitizenTypes";

const initState: State["citizen"] = {
  citizens: [],
  citizen: null,
  loading: false,
};

export function CitizenReducer(state = initState, action: Actions): State["citizen"] {
  switch (action.type) {
    case "GET_USER_CITIZENS": {
      return {
        ...state,
        citizens: action.citizens,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
