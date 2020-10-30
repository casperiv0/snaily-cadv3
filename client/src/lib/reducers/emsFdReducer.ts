import Deputy from "../../interfaces/Deputy";
import MedicalRecord from "../../interfaces/MedicalRecord";
import {
  CREATE_EMS_FD_DEPUTY,
  CREATE_EMS_FD_DEPUTY_ERROR,
  DELETE_EMS_DEPUTY,
  GET_CURRENT_EMS_STATUS,
  GET_MY_EMS_FD,
  SEARCH_MEDICAL_RECORD,
  SET_EMS_STATUS,
} from "../types";

const initState = {
  deputies: [],
  medicalRecords: [],
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
      type: typeof SET_EMS_STATUS;
      status: string;
      status2: string;
    }
  | {
      type: typeof GET_MY_EMS_FD;
      deputies: Deputy[];
    }
  | {
      type: typeof DELETE_EMS_DEPUTY;
      deputies: Deputy[];
    }
  | {
      type: typeof CREATE_EMS_FD_DEPUTY;
    }
  | {
      type: typeof CREATE_EMS_FD_DEPUTY_ERROR;
      error: string;
    }
  | {
      type: typeof SEARCH_MEDICAL_RECORD;
      medicalRecords: MedicalRecord[];
    };

export default function emsFdReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CURRENT_EMS_STATUS":
      return {
        ...state,
        status: action.status,
        status2: action.status2,
      };
    case "SET_EMS_STATUS":
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
    case "DELETE_EMS_DEPUTY":
      return {
        ...state,
        deputies: action.deputies,
      };
    case "CREATE_EMS_FD_DEPUTY":
      return {
        ...state,
      };
    case "CREATE_EMS_FD_DEPUTY_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "SEARCH_MEDICAL_RECORD":
      return {
        ...state,
        medicalRecords: action.medicalRecords,
      };
    default:
      return {
        ...state,
      };
  }
}
