import Citizen from "../../interfaces/Citizen";
import Company, { CompanyPost } from "../../interfaces/Company";
import State from "../../interfaces/State";
import Vehicle from "../../interfaces/Vehicle";
import {
  GET_COMPANY_DATA,
  CREATE_COMPANY,
  JOIN_COMPANY,
  GET_COMPANY_BY_ID,
  CREATE_COMPANY_POST_ERROR,
  GET_COMPANY_BY_ID_ERROR,
  DECLINE_EMPLOYEE,
  ACCEPT_EMPLOYEE,
  FIRE_EMPLOYEE,
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
      type: typeof CREATE_COMPANY;
    }
  | {
      type: typeof JOIN_COMPANY;
    }
  | {
      type: typeof GET_COMPANY_BY_ID;
      company: Company;
      posts: CompanyPost[];
      employees: Citizen[];
      vehicles: Vehicle[];
    }
  | {
      type: typeof CREATE_COMPANY_POST_ERROR;
      error: string;
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

export default function companyReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_COMPANY_DATA":
      return {
        ...state,
        companies: action.companies,
        citizens: action.citizens,
      };
    case "JOIN_COMPANY":
      return {
        ...state,
      };
    case "GET_COMPANY_BY_ID":
      return {
        ...state,
        company: action.company,
        posts: action.posts,
        employees: action.employees,
        vehicles: action.vehicles,
      };
    case "CREATE_COMPANY_POST_ERROR":
      return {
        ...state,
        error: action.error,
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
    default:
      return {
        ...state,
      };
  }
}
