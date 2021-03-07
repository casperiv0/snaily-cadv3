import { Item } from "../routes/management";

interface Code10 {
  id: string;
  code: string;
  color: string;
  what_pages: Item[];
  should_do: string; // should "set_off_duty" or "set_status"
}

export default Code10;
