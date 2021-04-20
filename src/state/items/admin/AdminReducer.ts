import { State } from "types/State";
import { Actions } from "./AdminTypes";

const initState: State["admin"] = {
  codes: [],
  penalCodes: [],
  citizens: [],
  expungementRequests: [],
  members: [],
  member: null,
  tempPassword: null,

  officers: [],
  ems_fd: [],
  unit: null,
};

export function AdminReducer(state = initState, action: Actions): State["admin"] {
  switch (action.type) {
    case "DELETE_10_CODE":
    case "UPDATE_10_CODE":
    case "GET_10_CODES": {
      return {
        ...state,
        codes: action.codes,
      };
    }
    case "DELETE_PENAL_CODE":
    case "UPDATE_PENAL_CODE":
    case "GET_PENAL_CODES": {
      return {
        ...state,
        penalCodes: action.penalCodes,
      };
    }
    case "GET_CITIZENS":
    case "DELETE_CITIZEN": {
      return {
        ...state,
        citizens: action.citizens,
      };
    }
    case "GET_EXPUNGEMENT_REQUESTS_ADMIN":
    case "UPDATE_EXPUNGEMENT_REQUEST": {
      return {
        ...state,
        expungementRequests: action.expungementRequests,
      };
    }
    case "DECLINE_MEMBER":
    case "ACCEPT_MEMBER":
    case "GET_MEMBERS": {
      return {
        ...state,
        members: action.members,
      };
    }
    case "UPDATE_MEMBER_PERMS":
    case "GET_MEMBER_BY_ID": {
      return {
        ...state,
        member: action.member,
      };
    }
    case "GET_ALL_UNITS": {
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
      };
    }
    case "GET_UNIT_BY_ID": {
      return {
        ...state,
        unit: action.unit,
      };
    }
    case "GET_TEMP_PASSWORD": {
      return {
        ...state,
        tempPassword: action.tempPassword,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
