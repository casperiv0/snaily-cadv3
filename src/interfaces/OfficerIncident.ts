import { Perm } from "./Perm";

export interface OfficerIncident {
  id: string;
  case_number: string;
  full_date: string;
  narrative: string;
  involved_officers: string[] | string;
  location: string;
  officer_name: string;
  officer_dept: string;
  firearms_involved: Perm;
  arrests_made: Perm;
  injuries: Perm;
  gsr: Perm;
  officer_id: string;
}
