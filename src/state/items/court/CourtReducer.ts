import { State } from "types/State";
import { Actions } from "./CourtTypes";

const initState: State["court"] = {
  expungementRequests: [],
  courtResult: null,
};

export function CourtReducer(state = initState, action: Actions): State["court"] {
  switch (action.type) {
    case "GET_EXPUNGEMENT_REQUESTS": {
      return {
        ...state,
        expungementRequests: action.expungementRequests,
      };
    }
    case "SEARCH_CITIZEN": {
      return { ...state, courtResult: action.courtResult };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
