import { State } from "types/State";
import { Actions } from "./CitizenTypes";

const initState: State["citizen"] = {
  citizens: [],
  citizen: null,
  loading: false,
  vehicles: [],
  weapons: [],
  medicalRecords: [],
  companies: [],
};

export function CitizenReducer(state = initState, action: Actions): State["citizen"] {
  switch (action.type) {
    case "GET_USER_CITIZENS": {
      return {
        ...state,
        citizens: action.citizens,
      };
    }
    case "UPDATE_CITIZEN_LICENSES":
    case "GET_CITIZEN_BY_ID": {
      return {
        ...state,
        citizen: action.citizen ?? null,
      };
    }
    case "GET_CITIZEN_VEHICLES":
    case "DELETE_VEHICLE_BY_ID":
    case "UPDATE_VEHICLE_BY_ID":
    case "REGISTER_VEHICLE": {
      return {
        ...state,
        vehicles: action.vehicles,
      };
    }
    case "GET_CITIZEN_WEAPONS":
    case "DELETE_WEAPON_BY_ID":
    case "UPDATE_WEAPON_BY_ID":
    case "REGISTER_WEAPON": {
      return {
        ...state,
        weapons: action.weapons,
      };
    }
    case "GET_MEDICAL_RECORDS":
    case "CREATE_MEDICAL_RECORD":
    case "DELETE_MEDICAL_RECORDS": {
      return {
        ...state,
        medicalRecords: action.medicalRecords,
      };
    }

    case "GET_USER_COMPANIES": {
      return {
        ...state,
        companies: action.companies ?? [],
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
