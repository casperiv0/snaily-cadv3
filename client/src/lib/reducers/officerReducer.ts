import { GET_CURRENT_OFFICER_STATUS, SET_STATUS, SET_ON_DUTY } from "../types";

const initState = {
  status: null /* 'on-duty' or 'off-duty' */,
  status2: "" /* '10-11', '10-5', '10-6', .. */,
  officerName: null,
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
      type: typeof SET_ON_DUTY;
      status: "on-duty" | "off-duty";
      status2: string;
      officerName: string;
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
    case "SET_ON_DUTY":
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
    default:
      return {
        ...state,
      };
  }
}
