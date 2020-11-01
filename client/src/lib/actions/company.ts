import { Dispatch } from "react";
import Citizen from "../../interfaces/Citizen";
import Company, { CompanyPost } from "../../interfaces/Company";
import Vehicle from "../../interfaces/Vehicle";
import { handleRequest, isSuccess } from "../functions";
import lang from "../../language.json";
import Logger from "../Logger";
import {
  GET_COMPANY_DATA,
  JOIN_COMPANY,
  CREATE_COMPANY,
  CREATE_COMPANY_ERROR,
  JOIN_COMPANY_ERROR,
  GET_COMPANY_BY_ID,
  CREATE_COMPANY_POST,
  CREATE_COMPANY_POST_ERROR,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  UPDATE_COMPANY_ERROR,
  SET_MESSAGE,
} from "../types";

interface IDispatch {
  type: string;
  citizens?: Citizen[];
  company?: Company;
  companies?: Company[];
  error?: string;
  message?: string;
  posts?: CompanyPost[];
  employees?: Citizen[];
  vehicles?: Vehicle[];
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
        employees: res.data.employees,
        vehicles: res.data.vehicles,
      });
    }
  } catch (e) {
    Logger.error(GET_COMPANY_BY_ID, e);
  }
};

export const createCompanyPost = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/company/post", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_COMPANY_POST,
      });
      window.location.href = `/company/${res.data.citizenId}/${res.data.companyId}`;
    } else {
      dispatch({
        type: CREATE_COMPANY_POST_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_COMPANY_POST, e);
  }
};

export const updateCompany = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/company/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_COMPANY,
      });
      dispatch({
        type: SET_MESSAGE,
        message: lang.citizen.company.updated_company,
      });
    } else {
      dispatch({
        type: UPDATE_COMPANY_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(UPDATE_COMPANY, e);
  }
};

export const deleteCompany = (id: string, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/company/${id}`, "DELETE", { citizenId });

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_COMPANY,
      });
      return (window.location.href = "/citizen");
    }
  } catch (e) {
    Logger.error(DELETE_COMPANY, e);
  }
};
