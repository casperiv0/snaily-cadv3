import { combineReducers } from "redux";

import authReducer from "./authReducer";
import bleetReducer from "./bleetReducer";
import globalReducer from "./globalReducer";
import callsReducer from "./callsReducer";
import officerReducer from "./officerReducer";
import boloReducer from "./boloReducer";
import dispatchReducer from "./dispatchReducer";
import trucklogsReducer from "./trucklogsReducer";
import emsFdReducer from "./emsFdReducer";
import citizenReducer from "./citizenReducer";
import valuesReducer from "./valuesReducer";
import adminReducer from "./adminReducer";
import companyReducer from "./companyReducer";

export default combineReducers({
  auth: authReducer,
  bleets: bleetReducer,
  global: globalReducer,
  calls: callsReducer,
  officers: officerReducer,
  bolos: boloReducer,
  dispatch: dispatchReducer,
  truck_logs: trucklogsReducer,
  ems_fd: emsFdReducer,
  citizen: citizenReducer,
  values: valuesReducer,
  admin: adminReducer,
  company: companyReducer,
});
