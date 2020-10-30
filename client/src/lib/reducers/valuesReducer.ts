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
  ADD_VALUE_ERROR,
  GET_VALUE_BY_ID,
  UPDATE_VALUE_BY_ID_ERROR,
  UPDATE_VALUE_BY_ID,
} from "../types";

const initState = {
  genders: [],
  "legal-statuses": [],
  ethnicities: [],
  departments: [],
  weapons: [],
  vehicles: [],
  error: null,
  value: null,
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
    }
  | {
      type: typeof ADD_VALUE_ERROR;
      error: string;
    }
  | {
      type: typeof GET_VALUE_BY_ID;
      value: Value;
    }
  | {
      type: typeof UPDATE_VALUE_BY_ID;
    }
  | {
      type: typeof UPDATE_VALUE_BY_ID_ERROR;
      error: string;
    };

export default function valuesReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_GENDERS":
      return {
        ...state,
        genders: action.genders,
      };

    case "GET_ETHNICITIES":
      return {
        ...state,
        ethnicities: action.ethnicities,
      };
    case "GET_LEGAL_STATUSES":
      return {
        ...state,
        "legal-statuses": action.legalStatuses,
      };
    case "GET_WEAPONS":
      return {
        ...state,
        weapons: action.weapons,
      };
    case "GET_VEHICLES":
      return {
        ...state,
        vehicles: action.vehicles,
      };
    case "GET_ADMIN_DEPARTMENTS":
      return {
        ...state,
        departments: action.departments,
      };
    case "DELETE_VALUE":
      return {
        ...state,
        [action.path]: action.values,
      };
    case "GET_VALUE_BY_ID":
      return {
        ...state,
        value: action.value,
      };
    case "ADD_VALUE_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "UPDATE_VALUE_BY_ID":
      return {
        ...state,
      };
    case "UPDATE_VALUE_BY_ID_ERROR":
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
