import Citizen from "../../interfaces/Citizen";
import MedicalRecord from "../../interfaces/MedicalRecord";
import Vehicle from "../../interfaces/Vehicle";
import Weapon from "../../interfaces/Weapon";
import {
  GET_CITIZENS,
  CREATE_CITIZEN_ERROR,
  GET_CITIZEN_BY_ID,
  GET_REGISTERED_VEHICLES,
  GET_REGISTERED_WEAPONS,
  DELETE_REGISTERED_WEAPON,
  REGISTER_WEAPON,
  REGISTER_WEAPON_ERROR,
  DELETE_REGISTERED_VEHICLE,
  REGISTER_VEHICLE_ERROR,
  REGISTER_VEHICLE,
  GET_MEDICAL_RECORDS,
  CREATE_MEDICAL_RECORD_ERROR,
  DELETE_MEDICAL_RECORD,
  DELETE_CITIZEN,
  UPDATE_VEHICLE,
  GET_VEHICLE_BY_ID,
  GET_ALL_CITIZENS,
  TRANSFER_VEHICLE_ERROR,
} from "../types";

const initState = {
  error: null,
  citizens: [],
  weapons: [],
  vehicles: [],
  medicalRecords: [],
  vehicle: null,
  citizen: null,
};

type Actions =
  | {
      type: typeof GET_CITIZENS;
      citizens: Citizen[];
    }
  | {
      type: typeof CREATE_CITIZEN_ERROR;
      error: string;
    }
  | {
      type: typeof GET_CITIZEN_BY_ID;
      citizen: Citizen;
    }
  | {
      type: typeof REGISTER_VEHICLE;
    }
  | {
      type: typeof REGISTER_VEHICLE_ERROR;
      error: string;
    }
  | {
      type: typeof GET_REGISTERED_VEHICLES;
      vehicles: Vehicle[];
    }
  | {
      type: typeof DELETE_REGISTERED_VEHICLE;
      vehicles: Vehicle[];
    }
  | {
      type: typeof REGISTER_WEAPON;
    }
  | {
      type: typeof REGISTER_WEAPON_ERROR;
      error: string;
    }
  | {
      type: typeof GET_REGISTERED_WEAPONS;
      weapons: Weapon[];
    }
  | {
      type: typeof DELETE_REGISTERED_WEAPON;
      weapons: Weapon[];
    }
  | {
      type: typeof GET_MEDICAL_RECORDS;
      medicalRecords: MedicalRecord[];
    }
  | {
      type: typeof CREATE_MEDICAL_RECORD_ERROR;
      error: string;
    }
  | {
      type: typeof DELETE_MEDICAL_RECORD;
      medicalRecords: MedicalRecord[];
    }
  | {
      type: typeof DELETE_CITIZEN;
    }
  | {
      type: typeof UPDATE_VEHICLE;
      vehicle: Vehicle;
    }
  | {
      type: typeof GET_VEHICLE_BY_ID;
      vehicle: Vehicle;
    }
  | {
      type: typeof GET_ALL_CITIZENS;
      citizens: Citizen[];
    }
  | {
      type: typeof TRANSFER_VEHICLE_ERROR;
      error: string;
    };

export default function citizenReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    case "CREATE_CITIZEN_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "GET_CITIZEN_BY_ID":
      return {
        ...state,
        citizen: action.citizen,
      };
    case "REGISTER_WEAPON":
      return {
        ...state,
      };
    case "REGISTER_WEAPON_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "GET_REGISTERED_WEAPONS":
      return {
        ...state,
        weapons: action.weapons,
      };
    case "DELETE_REGISTERED_WEAPON":
      return {
        ...state,
        weapons: action.weapons,
      };
    case "GET_REGISTERED_VEHICLES":
      return {
        ...state,
        vehicles: action.vehicles,
      };
    case "REGISTER_VEHICLE":
      return {
        ...state,
      };
    case "REGISTER_VEHICLE_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "DELETE_REGISTERED_VEHICLE":
      return {
        ...state,
        vehicles: action.vehicles,
      };
    case "GET_MEDICAL_RECORDS":
      return {
        ...state,
        medicalRecords: action.medicalRecords,
      };
    case "CREATE_MEDICAL_RECORD_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "DELETE_MEDICAL_RECORD":
      return {
        ...state,
        medicalRecords: action.medicalRecords,
      };
    case "DELETE_CITIZEN":
      return {
        ...state,
      };
    case "UPDATE_VEHICLE":
      return {
        ...state,
        vehicle: action.vehicle,
      };
    case "GET_VEHICLE_BY_ID":
      return {
        ...state,
        vehicle: action.vehicle,
      };
    case "GET_ALL_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    case "TRANSFER_VEHICLE_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return {
        ...state,
      };
  }
}
