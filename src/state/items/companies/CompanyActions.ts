import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import {
  CreateCompany,
  CreateCompanyPost,
  DeclineOrAcceptEmployee,
  GetCompanies,
  GetCompanyById,
  JoinCompany,
} from "./CompanyTypes";
import lang from "src/language.json";

export const getCompanies = (headers?: any) => async (dispatch: Dispatch<GetCompanies>) => {
  try {
    const res = await handleRequest("/companies", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_COMPANIES",
      companies: res.data.companies,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.error(error);
  }
};

export const joinCompany = (data: RequestData) => async (dispatch: Dispatch<JoinCompany>) => {
  try {
    const res = await handleRequest("/companies/join", "POST", data);

    dispatch({
      type: "JOIN_COMPANY",
    });

    return `/company/${res.data.citizenId}/${res.data.companyId}`;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const createCompany = (data: RequestData) => async (dispatch: Dispatch<CreateCompany>) => {
  try {
    const res = await handleRequest("/companies/create", "POST", data);

    dispatch({
      type: "CREATE_COMPANY",
    });

    return `/company/${res.data.citizenId}/${res.data.companyId}`;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const deleteCompanyById = (id: string, citizenId?: string) => async (
  dispatch: Dispatch<GetCompanies>,
) => {
  try {
    const res = await handleRequest(`/companies/${id}?citizenId=${citizenId}`, "DELETE");

    dispatch({
      type: "DELETE_COMPANY_BY_ID",
      companies: res.data.companies,
    });

    return notify.success(lang.admin.company.delete_success);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const getCompanyById = (id: string, citizenId: string, headers?: any) => async (
  dispatch: Dispatch<GetCompanyById>,
) => {
  try {
    const res = await handleRequest(`/companies/${id}?citizenId=${citizenId}`, "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_COMPANY_BY_ID",
      company: res.data.company,
      employees: res.data.employees,
      posts: res.data.posts,
      vehicles: res.data.vehicles,
    });

    return true;
  } catch (e) {
    return false;
  }
};

export const createCompanyPost = (id: string, citizenId: string, data: RequestData) => async (
  dispatch: Dispatch<CreateCompanyPost>,
) => {
  try {
    const res = await handleRequest(`/companies/${id}/posts?citizenId=${citizenId}`, "POST", data);

    dispatch({
      type: "CREATE_COMPANY_POST",
      posts: res.data.posts,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const updateCompany = (id: string, citizenId: string, data: RequestData) => async (
  dispatch: Dispatch<CreateCompanyPost>,
) => {
  try {
    const res = await handleRequest(`/companies/${id}?citizenId=${citizenId}`, "PUT", data);

    dispatch({
      type: "CREATE_COMPANY_POST",
      posts: res.data.posts,
    });

    return notify.success(lang.citizen.company.updated_company);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const updateEmployeeStatus = (
  companyId: string,
  citizenId: string,
  employeeId: string,
  type: "ACCEPT" | "DECLINE" | "FIRE" | "UPDATE",
  data?: RequestData,
) => async (dispatch: Dispatch<DeclineOrAcceptEmployee>) => {
  try {
    const res = await handleRequest(
      `/companies/${companyId}/${employeeId}?citizenId=${citizenId}&type=${type}`,
      "PUT",
      data,
    );

    dispatch({
      type: "ACCEPT_OR_DECLINE_EMPLOYEE",
      employees: res.data.employees,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
