import { State } from "types/State";
import { Actions } from "./TruckLogTypes";

const initState: State["truckLogs"] = {
  logs: [],
};

export function TruckLogReducer(state = initState, action: Actions): State["truckLogs"] {
  switch (action.type) {
    case "CREATE_TRUCK_LOG":
    case "DELETE_TRUCK_LOG":
    case "GET_TRUCK_LOGS": {
      return {
        ...state,
        logs: action.logs,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
