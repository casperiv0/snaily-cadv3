interface Company {
  id: string;
  name: string;
  owner: string;
  user_id: string;
  citizen_id: string;
  whitelisted: "0" | "1";
  address: string;
}

export default Company;
