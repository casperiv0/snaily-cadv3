import { Citizen } from "types/Citizen";
import { Company, CompanyPost } from "types/Company";
import { Vehicle } from "types/Vehicle";

export interface GetCompanies {
  type: "GET_COMPANIES" | "DELETE_COMPANY_BY_ID";
  companies: Company[];
}

export interface JoinCompany {
  type: "JOIN_COMPANY";
}

export interface CreateCompany {
  type: "CREATE_COMPANY";
}

export interface GetCompanyById {
  type: "GET_COMPANY_BY_ID";
  posts: CompanyPost[];
  company: Company;
  employees: Citizen[];
  vehicles: Vehicle[];
}

export interface CreateCompanyPost {
  type: "CREATE_COMPANY_POST";
  posts: CompanyPost[];
}

export interface GetCompanyError {
  type: "GET_COMPANY_ERROR";
  error: string;
}

export interface DeclineOrAcceptEmployee {
  type: "ACCEPT_OR_DECLINE_EMPLOYEE";
  employees: Citizen[];
}

export type Actions =
  | GetCompanies
  | JoinCompany
  | GetCompanyById
  | CreateCompanyPost
  | GetCompanyError
  | DeclineOrAcceptEmployee;
