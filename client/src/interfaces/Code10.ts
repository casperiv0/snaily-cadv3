import { Unit } from "./Call";

interface Code10 {
  id: string;
  code: string;
  color: string;
  what_pages: Unit[];
  should_do: string; // should "set_off_duty" or "set_status"
  position: number;
}

export default Code10;
