import { Unit } from "./Call";

export interface Code10 {
  id: string;
  code: string;
  color: string;
  what_pages: Unit[];
  should_do: string; // should "set_off_duty" or "set_status"
  position: number;
}
