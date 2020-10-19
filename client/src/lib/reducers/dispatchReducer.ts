import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import { GET_ACTIVE_UNITS } from "../types";

const initState = {
  officers: [],
  ems_fd: [],
};

type Actions = {
  type: typeof GET_ACTIVE_UNITS;
  officers: Officer[];
  ems_fd: Deputy[];
};
export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_ACTIVE_UNITS":
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
      };
    default:
      return {
        ...state,
      };
  }
}
