import { Dispatch } from "react";
import Citizen from "../../interfaces/Citizen";
import Company, { CompanyPost } from "../../interfaces/Company";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import {
  GET_COMPANY_DATA,
  JOIN_COMPANY,
  CREATE_COMPANY,
  CREATE_COMPANY_ERROR,
  JOIN_COMPANY_ERROR,
  GET_COMPANY_BY_ID,
} from "../types";

interface IDispatch {
  type: string;
  citizens?: Citizen[];
  company?: Company;
  companies?: Company[];
  error?: string;
  message?: string;
  posts?: CompanyPost[];
}

export const getCompanyData = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/company", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_COMPANY_DATA,
        companies: res.data.companies,
        citizens: res.data.citizens,
      });
    }
  } catch (e) {
    Logger.error(GET_COMPANY_DATA, e);
  }
};

export const joinCompany = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/company/join", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: JOIN_COMPANY,
      });
      window.location.href = `/company/${res.data.citizenId}/${res.data.companyId}`;
    } else {
      dispatch({
        type: JOIN_COMPANY_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(JOIN_COMPANY, e);
  }
};

export const createCompany = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/company/create", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_COMPANY,
      });
      window.location.href = `/company/${res.data.citizenId}/${res.data.companyId}`;
    } else {
      dispatch({
        type: CREATE_COMPANY_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_COMPANY, e);
  }
};

export const getCompanyById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/company/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_COMPANY_BY_ID,
        company: res.data.company,
        posts: res.data.posts,
      });
    }
  } catch (e) {
    Logger.error(GET_COMPANY_BY_ID, e);
  }
};
