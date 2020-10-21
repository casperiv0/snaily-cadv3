import Value from "../../interfaces/Value";
import {
  ADD_ETHNICITY,
  ADD_GENDER,
  DELETE_ETHNICITY,
  DELETE_GENDER,
  GET_ETHNICITIES,
  GET_GENDERS,
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
    default:
      return {
        ...state,
      };
  }
}
