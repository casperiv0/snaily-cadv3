import { State } from "types/State";
import { Actions } from "./CitizenTypes";

const initState: State["citizen"] = {
  citizens: [],
  citizen: null,
  loading: false,
  vehicles: [],
  weapons: [],
};

export function CitizenReducer(state = initState, action: Actions): State["citizen"] {
  switch (action.type) {
    case "GET_USER_CITIZENS": {
      return {
        ...state,
        citizens: action.citizens,
      };
    }
    case "GET_CITIZEN_BY_ID": {
      return {
        ...state,
        citizen: action.citizen,
      };
    }
    case "REGISTER_VEHICLE": {
      return {
        ...state,
        vehicles: action.vehicles,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
