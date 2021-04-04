import State from "../../interfaces/State";
import Value from "../../interfaces/Value";
import ValuePaths from "../../interfaces/ValuePaths";
import {
  DELETE_VALUE,
  ADD_VALUE,
  UPDATE_VALUE_BY_ID,
  VALUES_SET_LOADING,
  GET_VALUES,
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
      type: typeof DELETE_VALUE;
      values: Value[];
      path: ValuePaths;
    }
  | {
      type: typeof ADD_VALUE;
      values: Value[];
      path: ValuePaths;
    }
  | {
      type: typeof UPDATE_VALUE_BY_ID;
      values: Value[];
      path: ValuePaths;
    }
  | {
      type: typeof VALUES_SET_LOADING;
      loading: boolean;
    }
  | {
      type: typeof GET_VALUES;
      values: Value[];
      path: ValuePaths;
    };

export default function valuesReducer(state = initState, action: Actions): State["values"] {
  switch (action.type) {
    case "DELETE_VALUE":
    case "UPDATE_VALUE_BY_ID":
    case "ADD_VALUE":
    case "GET_VALUES":
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
