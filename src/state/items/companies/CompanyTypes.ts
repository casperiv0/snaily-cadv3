import { Company } from "types/Company";

export interface GetCompanies {
  type: "GET_COMPANIES";
  companies: Company[];
}

export type Actions = GetCompanies;
