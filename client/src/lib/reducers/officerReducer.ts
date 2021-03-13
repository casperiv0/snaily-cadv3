import Department from "../../interfaces/Department";
import Officer, { OfficerLog } from "../../interfaces/Officer";
import State from "../../interfaces/State";
import {
  GET_CURRENT_OFFICER_STATUS,
  SET_STATUS,
  GET_MY_OFFICERS,
  DELETE_OFFICER_BY_ID,
  GET_DEPARTMENTS,
  CREATE_OFFICER,
  CREATE_WARRANT,
  PLATE_SEARCH,
  NAME_SEARCH,
  WEAPON_SEARCH,
  CREATE_WRITTEN_WARNING,
  CREATE_ARREST_REPORT,
  CREATE_TICKET,
  GET_MY_OFFICER_LOGS,
} from "../types";

const initState: State["officers"] = {
  status: null /* 'on-duty' or 'off-duty' */,
  status2: "" /* '10-11', '10-5', '10-6', .. */,
  officers: [],
  departments: [],
  error: "",
  search: null,
  activeOfficer: null,
  names: [],
  logs: [],
};

type Actions =
  | {
      type: typeof GET_CURRENT_OFFICER_STATUS;
      status: "on-duty" | "off-duty";
      status2: string;
      activeOfficer: Officer;
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
      type: typeof CREATE_WARRANT;
      message: string;
    }
  | {
      type: typeof NAME_SEARCH;
      search: object;
    }
  | {
      type: typeof PLATE_SEARCH;
      search: object;
    }
  | {
      type: typeof WEAPON_SEARCH;
      search: object;
    }
  | {
      type: typeof CREATE_WRITTEN_WARNING;
    }
  | {
      type: typeof CREATE_ARREST_REPORT;
    }
  | {
      type: typeof CREATE_TICKET;
    }
  | {
      type: "SEARCH_NAMES";
      names: string[];
    }
  | {
      type: typeof GET_MY_OFFICER_LOGS;
      logs: OfficerLog[];
    };

export default function officerReducer(state = initState, action: Actions): State["officers"] {
  switch (action.type) {
    case "GET_CURRENT_OFFICER_STATUS":
      return {
        ...state,
        status: action.status,
        status2: action.status2,
        activeOfficer: action.activeOfficer,
      };
    case "SET_STATUS":
      return {
        ...state,
        status2: action.status2,
      };
    case "GET_MY_OFFICER_LOGS":
      return {
        ...state,
        logs: action.logs,
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
    case "CREATE_WARRANT":
      return {
        ...state,
        error: null,
      };
    case "NAME_SEARCH":
      return {
        ...state,
        search: { type: "name", ...action.search },
      };
    case "WEAPON_SEARCH":
      return {
        ...state,
        search: { type: "weapon", ...action.search },
      };
    case "PLATE_SEARCH":
      return {
        ...state,
        search: { type: "plate", ...action.search },
      };
    case "CREATE_WRITTEN_WARNING":
      return {
        ...state,
        error: null,
      };
    case "CREATE_ARREST_REPORT":
      return {
        ...state,
        error: null,
      };
    case "CREATE_TICKET":
      return {
        ...state,
        error: null,
      };
    case "SEARCH_NAMES":
      return {
        ...state,
        names: action.names,
      };
    default:
      return {
        ...state,
      };
  }
}
