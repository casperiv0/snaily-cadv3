import Citizen from "./Citizen";

interface MedicalRecord {
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

export default MedicalRecord;
