import { Perm } from "./User";

interface CadInfo {
  id: string;
  cad_name: string;
  owner: string;
  AOP: string;
  tow_whitelisted: Perm;
  whitelisted: Perm;
  webhook_url: string;
  plate_length: number;
  signal_100: Perm;
}

export default CadInfo;
