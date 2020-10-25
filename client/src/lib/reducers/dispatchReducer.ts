import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import { ADDRESS_SEARCH, GET_ACTIVE_UNITS } from "../types";

const initState = {
  officers: [],
  ems_fd: [],
  search: null,
};

type Actions =
  | {
      type: typeof GET_ACTIVE_UNITS;
      officers: Officer[];
      ems_fd: Deputy[];
    }
  | {
      type: typeof ADDRESS_SEARCH;
      search: object;
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_ACTIVE_UNITS":
      return {
        ...state,
        officers: action.officers,
        ems_fd: action.ems_fd,
      };
    case "ADDRESS_SEARCH":
      return {
        ...state,
        search: action.search,
      };
    default:
      return {
        ...state,
      };
  }
}
