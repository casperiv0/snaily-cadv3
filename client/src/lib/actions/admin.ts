import Logger from "../Logger";
import { handleRequest, isSuccess } from "../functions";
import { DELETE_COMPANY, GET_COMPANIES } from "../types";
import Company from "../../interfaces/Company";
import { Dispatch } from "react";

interface IDispatch {
  type: string;
  message?: string;
  error?: string;
  companies?: Company[];
}

export const getCompanies = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/admin/management/companies", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_COMPANIES,
        companies: res.data.companies || [],
      });
    }
  } catch (e) {
    Logger.error(GET_COMPANIES, e);
  }
};

export const deleteCompanyById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/companies/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_COMPANY,
        companies: res.data.companies,
      });
    }
  } catch (e) {
    Logger.error(DELETE_COMPANY, e);
  }
};
