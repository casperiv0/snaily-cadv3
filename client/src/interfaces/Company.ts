import { Perm } from "./User";

interface Company {
  id: string;
  name: string;
  owner: string;
  user_id: string;
  citizen_id: string;
  whitelisted: Perm;
  address: string;
}

export interface CompanyPost {
  id: string;
  business_id: string;
  uploaded_at: string;
  uploaded_by: string;
  title: string;
  description: string;
  citizen_id: string;
  user_id: string;
}

export default Company;
