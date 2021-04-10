import { State } from "types/State";
import { Actions } from "./ValuesTypes";

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

export function ValuesReducer(state = initState, action: Actions): State["values"] {
  switch (action.type) {
    case "DELETE_VALUE_BY_ID":
    case "UPDATE_VALUE_BY_ID":
    case "ADD_VALUE":
    case "GET_VALUES":
      return {
        ...state,
        [action.path]: action.values,
      };
    default: {
      return {
        ...state,
      };
    }
  }
}
