import IUser from "./IUser";

interface ICad {
  owner: IUser;
  cad_name: string;
  AOP: string;
  tow_whitelisted: "1" | "0";
  whitelisted: "1" | "0";
  company_whitelisted: "1" | "0";
}

export default ICad;
