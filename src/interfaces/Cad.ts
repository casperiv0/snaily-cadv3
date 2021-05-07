import { Perm } from "./Perm";

export interface Cad {
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
  max_citizens: string;
  show_aop: Perm;
  registration_code: string;
  weight_prefix: string;
  height_prefix: string;
  assigned_status: string;
  on_duty_status: string;

  version: {
    version: string;
    updatedVersion: string;
  };
}
