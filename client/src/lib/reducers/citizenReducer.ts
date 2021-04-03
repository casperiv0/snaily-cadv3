import { CourtResults, ExpungementRequest } from "../actions/court";
import Citizen from "../../interfaces/Citizen";
import MedicalRecord from "../../interfaces/MedicalRecord";
import State from "../../interfaces/State";
import Vehicle from "../../interfaces/Vehicle";
import Weapon from "../../interfaces/Weapon";
import {
  GET_CITIZENS,
  GET_CITIZEN_BY_ID,
  GET_REGISTERED_VEHICLES,
  GET_REGISTERED_WEAPONS,
  DELETE_REGISTERED_WEAPON,
  REGISTER_WEAPON,
  DELETE_REGISTERED_VEHICLE,
  REGISTER_VEHICLE,
  GET_MEDICAL_RECORDS,
  DELETE_MEDICAL_RECORD,
  UPDATE_VEHICLE,
  GET_VEHICLE_BY_ID,
  GET_ALL_CITIZENS,
  SEARCH_CITIZEN,
} from "../types";

const initState: State["citizen"] = {
  error: null,
  citizens: [],
  weapons: [],
  vehicles: [],
  medicalRecords: [],
  expungementRequests: [],
  vehicle: null,
  citizen: null,
  courtResult: null,
};

type Actions =
  | {
      type: typeof GET_CITIZENS;
      citizens: Citizen[];
    }
  | {
      type: typeof GET_CITIZEN_BY_ID;
      citizen: Citizen;
    }
  | {
      type:
        | typeof GET_REGISTERED_VEHICLES
        | typeof DELETE_REGISTERED_VEHICLE
        | typeof REGISTER_VEHICLE;
      vehicles: Vehicle[];
    }
  | {
      type:
        | typeof REGISTER_WEAPON
        | typeof GET_REGISTERED_WEAPONS
        | typeof DELETE_REGISTERED_WEAPON;
      weapons: Weapon[];
    }
  | {
      type: typeof GET_MEDICAL_RECORDS | typeof DELETE_MEDICAL_RECORD;
      medicalRecords: MedicalRecord[];
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
      type: typeof SEARCH_CITIZEN;
      courtResult: CourtResults;
    }
  | {
      type: "REQUEST_EXPUNGEMENT";
    }
  | {
      type: "GET_EXPUNGEMENT_REQUESTS";
      requests: ExpungementRequest[];
    };

export default function citizenReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_CITIZENS":
      return {
        ...state,
        citizens: action.citizens,
      };
    case "GET_CITIZEN_BY_ID":
      return {
        ...state,
        citizen: action.citizen,
      };
    case "REGISTER_WEAPON":
    case "GET_REGISTERED_WEAPONS":
    case "DELETE_REGISTERED_WEAPON":
      return {
        ...state,
        weapons: action.weapons,
      };
    case "GET_REGISTERED_VEHICLES":
    case "REGISTER_VEHICLE":
    case "DELETE_REGISTERED_VEHICLE":
      return {
        ...state,
        vehicles: action.vehicles,
      };
    case "GET_MEDICAL_RECORDS":
    case "DELETE_MEDICAL_RECORD":
      return {
        ...state,
        medicalRecords: action.medicalRecords,
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
    case "SEARCH_CITIZEN":
      return {
        ...state,
        courtResult: action.courtResult,
      };
    case "REQUEST_EXPUNGEMENT":
      return {
        ...state,
        courtResult: null,
      };
    case "GET_EXPUNGEMENT_REQUESTS":
      return {
        ...state,
        expungementRequests: action.requests,
      };
    default:
      return {
        ...state,
      };
  }
}
