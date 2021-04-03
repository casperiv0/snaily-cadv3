import Deputy from "../../interfaces/Deputy";
import MedicalRecord from "../../interfaces/MedicalRecord";
import State from "../../interfaces/State";
import {
  CREATE_EMS_FD_DEPUTY,
  DELETE_EMS_DEPUTY,
  GET_CURRENT_EMS_STATUS,
  GET_MY_EMS_FD,
  SEARCH_MEDICAL_RECORD,
  SET_EMS_STATUS,
} from "../types";

const initState: State["ems_fd"] = {
  deputies: [],
  medicalRecords: [],
  error: null,
  status: null,
  status2: "",
  activeDeputy: null,
};

type Actions =
  | {
      type: typeof GET_CURRENT_EMS_STATUS;
      status: "on-duty" | "off-duty";
      status2: string;
      activeDeputy: Deputy;
    }
  | {
      type: typeof SET_EMS_STATUS;
      status: string;
      status2: string;
    }
  | {
      type: typeof GET_MY_EMS_FD | typeof DELETE_EMS_DEPUTY | typeof CREATE_EMS_FD_DEPUTY;
      deputies: Deputy[];
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
        activeDeputy: action.activeDeputy,
      };
    case "SET_EMS_STATUS":
      return {
        ...state,
        status: action.status,
        status2: action.status2,
      };
    case "GET_MY_EMS_FD":
    case "DELETE_EMS_DEPUTY":
    case "CREATE_EMS_FD_DEPUTY":
      return {
        ...state,
        deputies: action.deputies,
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
