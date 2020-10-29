import Value from "../../interfaces/Value";
import {
  ADD_ETHNICITY,
  ADD_GENDER,
  ADD_LEGAL_STATUS,
  DELETE_ETHNICITY,
  DELETE_GENDER,
  DELETE_WEAPON,
  GET_DEPARTMENTS,
  GET_ETHNICITIES,
  GET_GENDERS,
  GET_LEGAL_STATUSES,
  GET_VEHICLES,
  GET_WEAPONS,
  UPDATE_ETHNICITY,
  UPDATE_GENDER,
  GET_ADMIN_DEPARTMENTS,
} from "../types";

const initState = {
  genders: [],
  legalStatuses: [],
  ethnicities: [],
  departments: [],
  weapons: [],
  vehicles: [],
};

type Actions =
  | {
      type: typeof GET_GENDERS;
      genders: Value[];
    }
  | {
      type: typeof DELETE_GENDER;
      genders: Value[];
    }
  | {
      type: typeof ADD_GENDER;
    }
  | {
      type: typeof UPDATE_GENDER;
    }
  | {
      type: typeof GET_ETHNICITIES;
      ethnicities: Value[];
    }
  | {
      type: typeof DELETE_ETHNICITY;
      ethnicities: Value[];
    }
  | {
      type: typeof ADD_ETHNICITY;
    }
  | {
      type: typeof UPDATE_ETHNICITY;
    }
  | {
      type: typeof GET_LEGAL_STATUSES;
      legalStatuses: Value[];
    }
  | {
      type: typeof ADD_LEGAL_STATUS;
    }
  | {
      type: typeof DELETE_ETHNICITY;
      legalStatuses: Value[];
    }
  | {
      type: typeof GET_WEAPONS;
      weapons: Value[];
    }
  | {
      type: typeof DELETE_WEAPON;
      weapons: Value[];
    }
  | {
      type: typeof GET_VEHICLES;
      vehicles: Value[];
    }
  | {
      type: typeof GET_ADMIN_DEPARTMENTS;
      departments: Value[];
    };

export default function (state = initState, action: Actions) {
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
        legalStatuses: action.legalStatuses,
      };
    case "GET_WEAPONS":
      return {
        ...state,
        weapons: action.weapons,
      };
    case "DELETE_WEAPON":
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
    default:
      return {
        ...state,
      };
  }
}
