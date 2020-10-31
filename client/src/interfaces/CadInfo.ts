interface CadInfo {
  id: string;
  cad_name: string;
  owner: string;
  AOP: string;
  tow_whitelisted: "0" | "1" | string;
  whitelisted: "0" | "1" | string;
  company_whitelisted: "0" | "1" | string;
}

export default CadInfo;
