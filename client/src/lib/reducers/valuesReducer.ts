import Value from "../../interfaces/Value";
import {
  ADD_ETHNICITY,
  ADD_GENDER,
  ADD_LEGAL_STATUS,
  DELETE_ETHNICITY,
  DELETE_GENDER,
  GET_ETHNICITIES,
  GET_GENDERS,
  GET_LEGAL_STATUSES,
  UPDATE_ETHNICITY,
  UPDATE_GENDER,
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
    default:
      return {
        ...state,
      };
  }
}
