import { Perm } from "./Perm";

export interface Officer {
  id: string;
  officer_name: string;
  officer_dept: string;
  user_id: string;
  status: string;
  status2: string;
  callsign: string;
  rank: string;
  citizen_id: string;

  citizen: {
    full_name: string;
  };
}

export interface OfficerLog {
  id: string;
  officer_id: string;
  user_id: string;
  started_at: string;
  ended_at: string;
  active: Perm;
}
