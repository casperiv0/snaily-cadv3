import { State } from "types/State";
import { Actions } from "./EmsFdTypes";

const initState: State["ems_fd"] = {
  activeDeputy: null,
  deputies: [],
  medicalRecords: [],
};

export function EmsFdReducer(state = initState, action: Actions): State["ems_fd"] {
  switch (action.type) {
    case "GET_DEPUTIES":
    case "CREATE_DEPUTY":
    case "DELETE_DEPUTY": {
      return {
        ...state,
        deputies: action.deputies,
      };
    }

    case "SET_EMS_FD_STATUS":
    case "GET_ACTIVE_DEPUTY": {
      return {
        ...state,
        activeDeputy: action.deputy,
      };
    }
    case "SEARCH_MEDICAL_RECORDS": {
      return {
        ...state,
        medicalRecords: action.medicalRecords,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
