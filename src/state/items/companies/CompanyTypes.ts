import { Company } from "types/Company";

export interface GetCompanies {
  type: "GET_COMPANIES";
  companies: Company[];
}

export interface JoinCompany {
  type: "JOIN_COMPANY";
}

export interface CreateCompany {
  type: "CREATE_COMPANY";
}

export type Actions = GetCompanies | JoinCompany;
