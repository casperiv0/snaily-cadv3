import { Actions } from "./RecordTypes";

const initState = {};

export function RecordReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "CREATE_ARREST_REPORT":
    case "CREATE_TICKET":
    case "CREATE_WARRANT":
    case "CREATE_WRITTEN_WARNING":
    default: {
      return {
        ...state,
      };
    }
  }
}
