import TruckLog from "../../interfaces/TruckLog";
import { GET_TRUCK_LOGS } from "../types";

const initState = {
  logs: [],
};

type Actions = {
  type: typeof GET_TRUCK_LOGS;
  logs: TruckLog[];
};

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_TRUCK_LOGS":
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
