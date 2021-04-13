import { combineReducers } from "redux";
import { AuthReducer } from "./auth/AuthReducer";
import { GlobalReducer } from "./global/GlobalReducer";
import { CitizenReducer } from "./citizen/CitizenReducer";
import { CallReducer } from "./calls/CallReducer";
import { TruckLogReducer } from "./truck-logs/TruckLogReducer";
import { ValuesReducer } from "./values/ValuesReducer";
import { CompanyReducer } from "./companies/CompanyReducer";
import { AdminReducer } from "./admin/AdminReducer";
import { BleeterReducer } from "./bleeter/BleeterReducer";
import { CourtReducer } from "./court/CourtReducer";
import { DispatchReducer } from "./dispatch/DispatchReducer";
import { OfficerReducer } from "./officer/OfficerReducer";
import { BoloReducer } from "./bolos/BoloReducer";

export default combineReducers({
  auth: AuthReducer,
  global: GlobalReducer,
  citizen: CitizenReducer,
  calls: CallReducer,
  truckLogs: TruckLogReducer,
  values: ValuesReducer,
  companies: CompanyReducer,
  admin: AdminReducer,
  bleeter: BleeterReducer,
  court: CourtReducer,
  dispatch: DispatchReducer,
  officers: OfficerReducer,
  bolos: BoloReducer,
});
