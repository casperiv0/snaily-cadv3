import Citizen from "../../interfaces/Citizen";
import Company from "../../interfaces/Company";
import User from "../../interfaces/User";
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
} from "../types";

const initState = {
  error: null,
  companies: [],
  members: [],
  citizens: [],
  member: null,
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
    }
  | {
      type: typeof DELETE_CITIZEN;
      citizens: Citizen[];
    }
  | {
      type: typeof GET_MEMBERS;
      members: User[];
    }
  | {
      type: typeof GET_MEMBER_BY_ID;
      member: User;
    }
  | {
      type: typeof UPDATE_MEMBER_PERMS;
      member: User;
    }
  | {
      type: typeof BAN_MEMBER;
      member: User;
    }
  | {
      type: typeof UN_BAN_MEMBER;
      member: User;
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
    case "DELETE_CITIZEN":
      return {
        ...state,
        citizens: action.citizens,
      };
    case "GET_MEMBERS":
      return {
        ...state,
        members: action.members,
      };
    case "GET_MEMBER_BY_ID":
      return {
        ...state,
        member: action.member,
      };
    case "UPDATE_MEMBER_PERMS":
      return {
        ...state,
        member: action.member,
      };
    case "BAN_MEMBER":
      return {
        ...state,
        member: action.member,
      };
    case "UN_BAN_MEMBER":
      return {
        ...state,
        member: action.member,
      };
    default:
      return {
        ...state,
      };
  }
}
