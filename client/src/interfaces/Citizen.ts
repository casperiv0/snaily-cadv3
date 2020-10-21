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
  rank: "owner" | "manager" | "employee" | "";
  vehicle_reg: string;
  posts: string;
  citizen_picture: string;
  b_status: string;
}

export default Citizen;
