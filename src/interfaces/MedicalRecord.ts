import { Citizen } from "./Citizen";

export interface MedicalRecord {
  id: string;
  type: string;
  short_info: string;
  name: string;
  citizen_id: string;

  citizen?: {
    dead: Citizen["dead"];
    dead_on: Citizen["dead_on"];
  };
}
