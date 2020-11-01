import Citizen from "../../interfaces/Citizen";
import Company, { CompanyPost } from "../../interfaces/Company";
import {
  GET_COMPANY_DATA,
  CREATE_COMPANY_ERROR,
  CREATE_COMPANY,
  JOIN_COMPANY,
  JOIN_COMPANY_ERROR,
  GET_COMPANY_BY_ID,
} from "../types";

const initState = {
  citizens: [],
  companies: [],
  company: null,
  error: null,
  posts: [],
};

type Actions =
  | {
      type: typeof GET_COMPANY_DATA;
      companies: Company[];
      citizens: Citizen[];
    }
  | {
      type: typeof CREATE_COMPANY_ERROR;
      error: string;
    }
  | {
      type: typeof CREATE_COMPANY;
    }
  | {
      type: typeof JOIN_COMPANY;
    }
  | {
      type: typeof JOIN_COMPANY_ERROR;
      error: string;
    }
  | {
      type: typeof GET_COMPANY_BY_ID;
      company: Company;
      posts: CompanyPost[];
    };

export default function companyReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_COMPANY_DATA":
      return {
        ...state,
        companies: action.companies,
        citizens: action.citizens,
      };
    case "CREATE_COMPANY_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "JOIN_COMPANY":
      return {
        ...state,
      };
    case "JOIN_COMPANY_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "GET_COMPANY_BY_ID":
      return {
        ...state,
        company: action.company,
        posts: action.posts,
      };
    default:
      return {
        ...state,
      };
  }
}
