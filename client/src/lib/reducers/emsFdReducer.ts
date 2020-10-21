import Deputy from "../../interfaces/Deputy";
import { GET_CURRENT_EMS_STATUS, GET_MY_EMS_FD } from "../types";

const initState = {
  deputies: [],
  error: null,
  status: null /* 'on-duty' or 'off-duty' */,
  status2: "" /* '10-11', '10-5', '10-6', .. */,
};

type Actions =
  | {
      type: typeof GET_CURRENT_EMS_STATUS;
      status: "on-duty" | "off-duty";
      status2: string;
    }
  | {
      type: typeof GET_MY_EMS_FD;
      deputies: Deputy[];
    };

export default function (state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CURRENT_EMS_STATUS":
      return {
        ...state,
        status: action.status,
        status2: action.status2,
      };
    case "GET_MY_EMS_FD":
      return {
        ...state,
        deputies: action.deputies,
      };
    default:
      return {
        ...state,
      };
  }
}
