import State from "../../interfaces/State";
import Value from "../../interfaces/Value";
import {
  GET_ETHNICITIES,
  GET_GENDERS,
  GET_LEGAL_STATUSES,
  GET_VEHICLES,
  GET_WEAPONS,
  UPDATE_ETHNICITY,
  UPDATE_GENDER,
  GET_ADMIN_DEPARTMENTS,
  DELETE_VALUE,
  ADD_VALUE,
  UPDATE_VALUE_BY_ID,
  VALUES_SET_LOADING,
  GET_CALL_TYPES,
} from "../types";

const initState: State["values"] = {
  genders: [],
  "legal-statuses": [],
  "call-types": [],
  ethnicities: [],
  departments: [],
  weapons: [],
  vehicles: [],
  error: null,
  value: null,
  loading: true,
};

type Actions =
  | {
      type: typeof GET_GENDERS;
      genders: Value[];
    }
  | {
      type: typeof UPDATE_GENDER;
    }
  | {
      type: typeof GET_ETHNICITIES;
      ethnicities: Value[];
    }
  | {
      type: typeof UPDATE_ETHNICITY;
    }
  | {
      type: typeof GET_LEGAL_STATUSES;
      legalStatuses: Value[];
    }
  | {
      type: typeof GET_WEAPONS;
      weapons: Value[];
    }
  | {
      type: typeof GET_VEHICLES;
      vehicles: Value[];
    }
  | {
      type: typeof GET_ADMIN_DEPARTMENTS;
      departments: Value[];
    }
  | {
      type: typeof DELETE_VALUE;
      values: Value[];
      path: string;
    }
  | {
      type: typeof ADD_VALUE;
      values: Value[];
      path: string;
    }
  | {
      type: typeof UPDATE_VALUE_BY_ID;
      values: Value[];
      path: string;
    }
  | {
      type: typeof VALUES_SET_LOADING;
      loading: boolean;
    }
  | {
      type: typeof GET_CALL_TYPES;
      callTypes: Value[];
    };

export default function valuesReducer(state = initState, action: Actions): State["values"] {
  switch (action.type) {
    case "GET_GENDERS":
      return {
        ...state,
        genders: action.genders,
        loading: false,
      };

    case "GET_ETHNICITIES":
      return {
        ...state,
        ethnicities: action.ethnicities,
        loading: false,
      };
    case "GET_LEGAL_STATUSES":
      return {
        ...state,
        "legal-statuses": action.legalStatuses,
        loading: false,
      };
    case "GET_WEAPONS":
      return {
        ...state,
        weapons: action.weapons,
        loading: false,
      };
    case "GET_VEHICLES":
      return {
        ...state,
        vehicles: action.vehicles,
        loading: false,
      };
    case "GET_CALL_TYPES":
      return {
        ...state,
        "call-types": action.callTypes,
        loading: false,
      };
    case "GET_ADMIN_DEPARTMENTS":
      return {
        ...state,
        departments: action.departments,
        loading: false,
      };
    case "DELETE_VALUE":
    case "UPDATE_VALUE_BY_ID":
    case "ADD_VALUE":
      return {
        ...state,
        [action.path]: action.values,
      };
    case "VALUES_SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return {
        ...state,
      };
  }
}
