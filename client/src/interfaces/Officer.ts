import { Perm } from "./User";

interface Officer {
  id: string;
  status: string;
  status2: string;
  officer_name: string;
  officer_dept: string;
  callsign?: string;
  rank: string;
}

export interface OfficerLog {
  id: string;
  officer_id: string;
  user_id: string;
  started_at: string;
  ended_at: string;
  active: Perm;
}

export default Officer;
