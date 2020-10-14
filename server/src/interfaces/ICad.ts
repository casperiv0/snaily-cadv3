import IUser from "./IUser";

interface ICad {
  owner: IUser;
  cad_name: string;
  AOP: string;
  tow_whitelisted: boolean;
  whitelisted: boolean;
  company_whitelisted: boolean;
}

export default ICad;
