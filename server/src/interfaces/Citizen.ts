import { Perm } from "./IUser";

interface Citizen {
  id: string;
  full_name: string;
  user_id: string;
  birth: string;
  gender: string;
  ethnicity: string;
  hair_color: string;
  eye_color: string;
  address: string;
  height: string;
  weight: string;
  dmv: string;
  fire_license: string;
  pilot_license: string;
  ccw: string;
  business: string;
  business_id: string;
  rank: string;
  vehicle_reg: string;
  posts: string;
  image_id: string;
  b_status: string;
  note: string;
  dead: Perm;
  dead_on: string;
}

export default Citizen;
