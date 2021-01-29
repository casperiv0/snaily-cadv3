import IUser, { Perm } from "./IUser";

interface ICad {
  owner: IUser;
  cad_name: string;
  AOP: string;
  tow_whitelisted: Perm;
  whitelisted: Perm;
  company_whitelisted: Perm;
}

export default ICad;
