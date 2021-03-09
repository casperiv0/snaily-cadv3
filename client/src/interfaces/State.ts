import Bleet from "./Bleet";
import Call from "./Call";
import User from "./User";
import Bolo from "./Bolo";
import Officer, { OfficerLog } from "./Officer";
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
import { ExpungementRequest } from "../lib/actions/court";
import PenalCode from "./PenalCode";
import Notification from "./Notification";
import Code10 from "./Code10";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User | null;
    error: string | null;
  };
  bleets: {
    bleets: Bleet[];
    bleet: Bleet | null;
    loading: boolean;
    error: string | null;
  };
  global: {
    cadInfo: CadInfo | null;
    aop: string | null;
    message: Message | null;
  };
  calls: {
    calls_911: Call[];
    tow_calls: TowCall[];
    taxi_calls: TowCall[];
  };
  officers: {
    status: string | null;
    status2: string | null;
    officers: Officer[];
    departments: Department[];
    error: string | null;
    search: any;
    activeOfficer: Officer | null;
    names: string[];
    logs: OfficerLog[];
  };
  bolos: {
    bolos: Bolo[];
    error: string | null;
  };
  dispatch: {
    officers: Officer[];
    ems_fd: Deputy[];
    search: any;
  };
  truck_logs: {
    error: string | null;
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
    error: string | null;
    citizens: Citizen[];
    citizen: Citizen | null;
    weapons: Weapon[];
    vehicles: Vehicle[];
    medicalRecords: MedicalRecord[];
    vehicle: Vehicle | null;
    courtResult: null | any;
    expungementRequests: ExpungementRequest[];
  };
  company: {
    citizens: Citizen[];
    companies: Company[];
    error: string | null;
    returnError: string | null;
    company: Company | null;
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
    departments: Value[];
    error: string | null;
    value: Value | null;
  };
  admin: {
    error: string | null;
    member: User | null;
    companies: Company[];
    citizens: Citizen[];
    members: User[];
    officers: Officer[];
    officer: Officer | null;
    expungementRequests: ExpungementRequest[];
    codes: Code10[];
    penalCodes: PenalCode[];
    loading: boolean;
  };
  notifications: {
    items: Notification[];
  };
}

export default State;
