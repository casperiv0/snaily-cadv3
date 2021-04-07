import { combineReducers } from "redux";
import { AuthReducer } from "./auth/AuthReducer";
import { GlobalReducer } from "./global/GlobalReducer";

export default combineReducers({
  auth: AuthReducer,
  global: GlobalReducer,
});
