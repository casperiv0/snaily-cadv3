import Department from "../../interfaces/Department";
import Officer from "../../interfaces/Officer";
import {
  GET_CURRENT_OFFICER_STATUS,
  SET_STATUS,
  GET_MY_OFFICERS,
  DELETE_OFFICER_BY_ID,
  GET_DEPARTMENTS,
  CREATE_OFFICER,
  CREATE_OFFICER_ERROR,
} from "../types";

const initState = {
  status: null /* 'on-duty' or 'off-duty' */,
  status2: "" /* '10-11', '10-5', '10-6', .. */,
  officerName: null,
  officers: [],
  departments: [],
  error: null,
};

type Actions =
  | {
      type: typeof GET_CURRENT_OFFICER_STATUS;
      status: "on-duty" | "off-duty";
      officerName: string;
      status2: string;
    }
  | {
      type: typeof SET_STATUS;
      status2: string;
      officerName: string;
    }
  | {
      type: typeof GET_MY_OFFICERS;
      officers: Officer[];
    }
  | {
      type: typeof DELETE_OFFICER_BY_ID;
      officers: Officer[];
    }
  | {
      type: typeof GET_DEPARTMENTS;
      departments: Department[];
    }
  | {
      type: typeof CREATE_OFFICER;
    }
  | {
      type: typeof CREATE_OFFICER_ERROR;
      error: string;
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CURRENT_OFFICER_STATUS":
      return {
        ...state,
        status: action.status,
        status2: action.status2,
        officerName: action.officerName,
      };
    case "SET_STATUS":
      return {
        ...state,
        status2: action.status2,
        officerName: action.officerName,
      };
    case "GET_MY_OFFICERS":
      return {
        ...state,
        officers: action.officers,
      };
    case "DELETE_OFFICER_BY_ID":
      return {
        ...state,
        officers: action.officers,
      };
    case "GET_DEPARTMENTS":
      return {
        ...state,
        departments: action.departments,
      };
    case "CREATE_OFFICER":
      return {
        ...state,
        error: null,
      };
    case "CREATE_OFFICER_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return {
        ...state,
      };
  }
}
