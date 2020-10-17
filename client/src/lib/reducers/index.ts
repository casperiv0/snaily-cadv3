import { combineReducers } from "redux";

import authReducer from "./authReducer";
import bleetReducer from "./bleetReducer";
import globalReducer from "./globalReducer";
import callsReducer from "./callsReducer";
import officerReducer from "./officerReducer";

export default combineReducers({
  auth: authReducer,
  bleets: bleetReducer,
  global: globalReducer,
  calls: callsReducer,
  officers: officerReducer,
});
