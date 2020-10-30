import TruckLog from "../../interfaces/TruckLog";
import {
  CREATE_TRUCK_LOG,
  DELETE_TRUCK_LOG,
  GET_TRUCK_LOGS,
  CREATE_TRUCK_LOG_ERROR,
} from "../types";

const initState = {
  logs: [],
  error: null,
};

type Actions =
  | {
      type: typeof GET_TRUCK_LOGS;
      logs: TruckLog[];
    }
  | {
      type: typeof CREATE_TRUCK_LOG;
    }
  | {
      type: typeof CREATE_TRUCK_LOG_ERROR;
      error: string;
    }
  | {
      type: typeof DELETE_TRUCK_LOG;
      logs: TruckLog[];
    };

export default function trucklogsReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_TRUCK_LOGS":
      return {
        ...state,
        logs: action.logs,
      };
    case "DELETE_TRUCK_LOG":
      return {
        ...state,
        logs: action.logs,
      };
    case "CREATE_TRUCK_LOG_ERROR":
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
