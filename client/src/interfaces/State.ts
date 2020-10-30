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
import Citizen from "./Citizen";
import Value from "./Value";
import Weapon from "./Weapon";
import Vehicle from "./Vehicle";
import Company from "./Company";

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
    search: any;
  };
  bolos: {
    bolos: Bolo[];
    error: string;
  };
  dispatch: {
    officers: Officer[];
    ems_fd: Deputy[];
    search: any;
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
  citizen: {
    error: string;
    citizens: Citizen[];
    citizen: Citizen;
    weapons: Weapon[];
    vehicles: Vehicle[];
    medicalRecords: MedicalRecord[];
    vehicle: Vehicle;
  };
  values: {
    genders: Value[];
    "legal-statuses": Value[];
    ethnicities: Value[];
    weapons: Value[];
    vehicles: Value[];
    error: string;
    value: Value;
  };
  admin: {
    error: string;
    companies: Company[];
    citizens: Citizen[];
    members: User[];
  };
}

export default State;
