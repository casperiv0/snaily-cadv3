import { State } from "types/State";
import { Actions } from "./CompanyTypes";

const initState: State["companies"] = {
  companies: [],
  company: null,
};

export function CompanyReducer(state = initState, action: Actions): State["companies"] {
  switch (action.type) {
    case "GET_COMPANIES": {
      return {
        ...state,
        companies: action.companies,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
