import { State } from "types/State";
import { Actions } from "./AdminTypes";

const initState: State["admin"] = {
  codes: [],
  penalCodes: [],
  citizens: [],
  expungementRequests: [],
  members: [],
  member: null,
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
    case "GET_EXPUNGEMENT_REQUESTS":
    case "UPDATE_EXPUNGEMENT_REQUEST": {
      return {
        ...state,
        expungementRequests: action.expungementRequests,
      };
    }
    case "GET_MEMBERS": {
      return {
        ...state,
        members: action.members,
      };
    }
    case "GET_MEMBER_BY_ID": {
      return {
        ...state,
        member: action.member,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
