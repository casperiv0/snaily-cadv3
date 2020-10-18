import { combineReducers } from "redux";

import authReducer from "./authReducer";
import bleetReducer from "./bleetReducer";
import globalReducer from "./globalReducer";
import callsReducer from "./callsReducer";
import officerReducer from "./officerReducer";
import boloReducer from "./boloReducer";
import dispatchReducer from "./dispatchReducer";

export default combineReducers({
  auth: authReducer,
  bleets: bleetReducer,
  global: globalReducer,
  calls: callsReducer,
  officers: officerReducer,
  bolos: boloReducer,
  dispatch: dispatchReducer,
});
