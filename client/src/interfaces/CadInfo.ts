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
  live_map_url: string;
  steam_api_key: string;
  features: string[];
}

export default CadInfo;
