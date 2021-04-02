import State from "../../interfaces/State";
import TruckLog from "../../interfaces/TruckLog";
import { CREATE_TRUCK_LOG, DELETE_TRUCK_LOG, GET_TRUCK_LOGS } from "../types";

const initState: State["truck_logs"] = {
  logs: [],
  error: null,
};

type Actions =
  | {
      type: typeof GET_TRUCK_LOGS;
      logs: TruckLog[];
    }
  | {
      type: typeof DELETE_TRUCK_LOG;
      logs: TruckLog[];
    }
  | {
      type: typeof CREATE_TRUCK_LOG;
      logs: TruckLog[];
    };

export default function trucklogsReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_TRUCK_LOGS":
    case "CREATE_TRUCK_LOG":
    case "DELETE_TRUCK_LOG":
      return {
        ...state,
        logs: action.logs,
      };
    default:
      return {
        ...state,
      };
  }
}
