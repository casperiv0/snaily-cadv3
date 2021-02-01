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
import Company, { CompanyPost } from "./Company";
import CadInfo from "./CadInfo";
import Message from "./Message";

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
    cadInfo: CadInfo;
    aop: string;
    message: Message;
  };
  calls: {
    calls_911: Call[];
    tow_calls: TowCall[];
  };
  officers: {
    status: string | null;
    status2: string | null;
    officers: Officer[];
    departments: Department[];
    error: string;
    search: any;
    activeOfficer: Officer | null;
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
    error: string | null;
    status: string | null;
    status2: string | null;
    activeDeputy: Deputy | null;
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
  company: {
    citizens: Citizen[];
    companies: Company[];
    error: string;
    returnError: string;
    company: Company;
    posts: CompanyPost[];
    employees: Citizen[];
    vehicles: Vehicle[];
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
    error: string | null;
    member: User | null;
    companies: Company[];
    citizens: Citizen[];
    members: User[];
    officers: Officer[];
    officer: Officer | null;
  };
}

export default State;
