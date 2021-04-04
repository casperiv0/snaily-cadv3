import Citizen from "../../interfaces/Citizen";
import Code10 from "../../interfaces/Code10";
import Company from "../../interfaces/Company";
import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import PenalCode from "../../interfaces/PenalCode";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import { ExpungementRequest } from "../actions/court";
import {
  BAN_MEMBER,
  DELETE_CITIZEN,
  DELETE_COMPANY,
  GET_CITIZENS,
  GET_COMPANIES,
  GET_MEMBERS,
  GET_MEMBER_BY_ID,
  UN_BAN_MEMBER,
  UPDATE_MEMBER_PERMS,
  ACCEPT_USER,
  DECLINE_USER,
  GET_ALL_UNITS,
  GET_UNIT_BY_ID,
  ACCEPT_OR_DECLINE_REQUEST,
  GET_ALl_EXPUNGEMENT_REQUESTS,
  GET_10_CODES,
  CREATE_10_CODE,
  DELETE_10_CODE,
  DELETE_PENAL_CODE,
  GET_PENAL_CODES,
  SET_ADMIN_LOADING,
  UPDATE_10_CODE,
  UPDATE_PENAL_CODES,
  GET_TEMP_PASSWORD,
  CREATE_PENAL_CODE,
} from "../types";

const initState: State["admin"] = {
  error: null,
  companies: [],
  members: [],
  citizens: [],
  officers: [],
  member: null,
  expungementRequests: [],
  codes: [],
  penalCodes: [],
  loading: false,
  ems_fd: [],
  unit: null,
  tempPassword: null,
};

type Actions =
  | {
      type: typeof GET_COMPANIES | typeof DELETE_COMPANY;
      companies: Company[];
    }
  | {
      type: typeof GET_CITIZENS | typeof DELETE_CITIZEN;
      citizens: Citizen[];
    }
  | {
      type: typeof GET_MEMBERS;
      members: User[];
    }
  | {
      type:
        | typeof GET_MEMBER_BY_ID
        | typeof BAN_MEMBER
        | typeof UN_BAN_MEMBER
        | typeof UPDATE_MEMBER_PERMS;
      member: User;
    }
  | {
      type: typeof ACCEPT_USER | typeof DECLINE_USER;
      members: User[];
    }
  | {
      type: typeof GET_ALL_UNITS;
      officers: Officer[];
      ems_fd: Deputy[];
    }
  | {
      type: typeof GET_UNIT_BY_ID;
      unit: Officer | Deputy;
    }
  | {
      type: typeof GET_ALl_EXPUNGEMENT_REQUESTS | typeof ACCEPT_OR_DECLINE_REQUEST;
      expungementRequests: ExpungementRequest[];
    }
  | {
      type:
        | typeof GET_10_CODES
        | typeof CREATE_10_CODE
        | typeof UPDATE_10_CODE
        | typeof DELETE_10_CODE;
      codes: Code10[];
    }
  | {
      type:
        | typeof DELETE_PENAL_CODE
        | typeof GET_PENAL_CODES
        | typeof UPDATE_PENAL_CODES
        | typeof CREATE_PENAL_CODE;
      penalCodes: PenalCode[];
    }
  | {
      type: typeof SET_ADMIN_LOADING;
      loading: boolean;
    }
  | {
      type: typeof GET_TEMP_PASSWORD;
      tempPassword: string;
    };

export default function adminReducer(state = initState, action: Actions): State["admin"] {
  switch (action.type) {
    case "GET_COMPANIES":
    case "DELETE_COMPANY":
      return {
        ...state,
        companies: action.companies,
        loading: false,
      };
    case "GET_CITIZENS":
    case "DELETE_CITIZEN":
      return {
        ...state,
        citizens: action.citizens,
        loading: false,
      };
    case "GET_MEMBERS":
      return {
        ...state,
        members: action.members,
        loading: false,
      };
    case "GET_MEMBER_BY_ID":
    case "UPDATE_MEMBER_PERMS":
    case "BAN_MEMBER":
    case "UN_BAN_MEMBER":
      return {
        ...state,
        member: action.member,
        loading: false,
      };

    case "ACCEPT_USER":
    case "DECLINE_USER":
      return {
        ...state,
        members: action.members,
      };
    case "GET_ALL_UNITS":
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
        loading: false,
      };
    case "GET_UNIT_BY_ID":
      return {
        ...state,
        unit: action.unit,
        loading: false,
      };
    case "ACCEPT_OR_DECLINE_REQUEST":
    case "GET_ALl_EXPUNGEMENT_REQUESTS":
      return {
        ...state,
        expungementRequests: action.expungementRequests,
        loading: false,
      };
    case "GET_10_CODES":
    case "DELETE_10_CODE":
    case "CREATE_10_CODE":
    case "UPDATE_10_CODE":
      return {
        ...state,
        codes: action.codes,
        loading: false,
      };

    case "DELETE_PENAL_CODE":
    case "GET_PENAL_CODES":
    case "UPDATE_PENAL_CODES":
    case "CREATE_PENAL_CODE":
      return {
        ...state,
        penalCodes: action.penalCodes,
        loading: false,
      };
    case "SET_ADMIN_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "GET_TEMP_PASSWORD":
      return {
        ...state,
        tempPassword: action.tempPassword,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}
