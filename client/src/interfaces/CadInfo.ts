interface CadInfo {
  id: string;
  cad_name: string;
  owner: string;
  AOP: string;
  tow_whitelisted: "0" | "1";
  whitelisted: "0" | "1";
  company_whitelisted: "0" | "1";
}

export default CadInfo;
