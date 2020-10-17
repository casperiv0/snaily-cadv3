import { combineReducers } from "redux";

import authReducer from "./authReducer";
import bleetReducer from "./bleetReducer";

export default combineReducers({
  auth: authReducer,
  bleets: bleetReducer,
});
