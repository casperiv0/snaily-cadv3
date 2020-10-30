import Citizen from "../../interfaces/Citizen";
import Company from "../../interfaces/Company";
import { DELETE_COMPANY, GET_CITIZENS, GET_COMPANIES } from "../types";

const initState = {
  error: null,
  companies: [],
  members: [],
  citizens: [],
};

type Actions =
  | {
      type: typeof GET_COMPANIES;
      companies: Company[];
    }
  | {
      type: typeof DELETE_COMPANY;
      companies: Company[];
    }
  | {
      type: typeof GET_CITIZENS;
      citizens: Citizen[];
    };

export default function adminReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_COMPANIES":
      return {
        ...state,
        companies: action.companies,
      };
    case "DELETE_COMPANY":
      return {
        ...state,
        companies: action.companies,
      };
    case "GET_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    default:
      return {
        ...state,
      };
  }
}
