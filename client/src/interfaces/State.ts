import Bleet from "./Bleet";
import Call from "./Call";
import User from "./User";
import Bolo from "./Bolo";
import Officer from "./Officer";
import Department from "./Department";
import Deputy from "./Deputy";
import TowCall from "./TowCall";
import TruckLog from "./TruckLog";
import MedicalRecord from "./MedicalRecord";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User;
    error: string;
  };
  bleets: {
    bleets: Bleet[];
    bleet: Bleet;
    loading: boolean;
    error: string;
  };
  global: {
    cadInfo: object;
    aop: string;
    message: string;
  };
  calls: {
    calls_911: Call[];
    tow_calls: TowCall[];
  };
  officers: {
    status: string;
    status2: string;
    officers: Officer[];
    departments: Department[];
    error: string;
  };
  bolos: {
    bolos: Bolo[];
  };
  dispatch: {
    officers: Officer[];
    ems_fd: Deputy[];
  };
  truck_logs: {
    error: string;
    logs: TruckLog[];
  };
  ems_fd: {
    deputies: Deputy[];
    medicalRecords: MedicalRecord[];
    error: string;
    status: string;
    status2: string;
  };
}

export default State;
