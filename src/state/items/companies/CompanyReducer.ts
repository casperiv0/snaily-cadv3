import { State } from "types/State";
import { Actions } from "./CompanyTypes";

const initState: State["companies"] = {
  company: null,
  error: null,
  posts: [],
  companies: [],
  vehicles: [],
  employees: [],
};

export function CompanyReducer(state = initState, action: Actions): State["companies"] {
  switch (action.type) {
    case "DELETE_COMPANY_BY_ID":
    case "GET_COMPANIES": {
      return {
        ...state,
        companies: action.companies,
      };
    }
    case "GET_COMPANY_BY_ID": {
      return {
        ...state,
        company: action.company,
        posts: action.posts,
        employees: action.employees,
        vehicles: action.vehicles,
      };
    }
    case "CREATE_COMPANY_POST": {
      return {
        ...state,
        posts: action.posts,
      };
    }
    case "GET_COMPANY_ERROR": {
      return {
        ...state,
        error: action.error,
      };
    }
    case "ACCEPT_OR_DECLINE_EMPLOYEE": {
      return {
        ...state,
        employees: action.employees,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
}
