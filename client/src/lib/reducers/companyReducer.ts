import Citizen from "../../interfaces/Citizen";
import Company, { CompanyPost } from "../../interfaces/Company";
import State from "../../interfaces/State";
import Vehicle from "../../interfaces/Vehicle";
import {
  GET_COMPANY_DATA,
  GET_COMPANY_BY_ID,
  GET_COMPANY_BY_ID_ERROR,
  DECLINE_EMPLOYEE,
  ACCEPT_EMPLOYEE,
  FIRE_EMPLOYEE,
  CREATE_COMPANY_POST,
} from "../types";

const initState: State["company"] = {
  citizens: [],
  companies: [],
  company: null,
  returnError: null,
  error: null,
  posts: [],
  employees: [],
  vehicles: [],
};

type Actions =
  | {
      type: typeof GET_COMPANY_DATA;
      companies: Company[];
      citizens: Citizen[];
    }
  | {
      type: typeof GET_COMPANY_BY_ID;
      company: Company;
      posts: CompanyPost[];
      employees: Citizen[];
      vehicles: Vehicle[];
    }
  | {
      type: typeof CREATE_COMPANY_POST;
      posts: CompanyPost[];
    }
  | {
      type: typeof GET_COMPANY_BY_ID_ERROR;
      error: string;
    }
  | {
      type: typeof DECLINE_EMPLOYEE;
      employees: Citizen[];
    }
  | {
      type: typeof ACCEPT_EMPLOYEE;
      employees: Citizen[];
    }
  | {
      type: typeof FIRE_EMPLOYEE;
      employees: Citizen[];
    };

export default function companyReducer(state = initState, action: Actions): State["company"] {
  switch (action.type) {
    case "GET_COMPANY_DATA":
      return {
        ...state,
        companies: action.companies,
        citizens: action.citizens,
      };
    case "GET_COMPANY_BY_ID":
      return {
        ...state,
        company: action.company,
        posts: action.posts,
        employees: action.employees,
        vehicles: action.vehicles,
      };
    case "GET_COMPANY_BY_ID_ERROR":
      return {
        ...state,
        returnError: action.error,
      };
    case "ACCEPT_EMPLOYEE":
      return {
        ...state,
        employees: action.employees,
      };
    case "DECLINE_EMPLOYEE":
      return {
        ...state,
        employees: action.employees,
      };
    case "FIRE_EMPLOYEE":
      return {
        ...state,
        employees: action.employees,
      };
    case "CREATE_COMPANY_POST":
      return {
        ...state,
        posts: action.posts,
      };
    default:
      return {
        ...state,
      };
  }
}
