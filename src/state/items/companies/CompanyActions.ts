import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { CreateCompany, GetCompanies, JoinCompany } from "./CompanyTypes";

export const getCompanies = (cookie?: string) => async (dispatch: Dispatch<GetCompanies>) => {
  try {
    const res = await handleRequest("/companies", "GET", { cookie });

    dispatch({
      type: "GET_COMPANIES",
      companies: res.data.companies,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
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
