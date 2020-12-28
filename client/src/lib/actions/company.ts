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
  CREATE_COMPANY_POST_ERROR,
  GET_COMPANY_BY_ID,
  GET_COMPANY_BY_ID_ERROR,
  CREATE_COMPANY_POST,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  SET_MESSAGE,
  UPDATE_EMPLOYEE,
  FIRE_EMPLOYEE,
  ACCEPT_EMPLOYEE,
  DECLINE_EMPLOYEE,
} from "../types";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  citizens?: Citizen[];
  company?: Company;
  companies?: Company[];
  error?: string;
  message?: Message;
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
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
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
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
    }
  } catch (e) {
    Logger.error(CREATE_COMPANY, e);
  }
};

export const getCompanyById = (id: string, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/company/${id}`, "POST", { citizenId });

    if (isSuccess(res)) {
      dispatch({
        type: GET_COMPANY_BY_ID,
        company: res.data.company,
        posts: res.data.posts,
        employees: res.data.employees,
        vehicles: res.data.vehicles,
      });
    } else {
      dispatch({
        type: GET_COMPANY_BY_ID_ERROR,
        error: res.data.error,
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
        message: { msg: lang.citizen.company.updated_company, type: "success" },
      });
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
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

export const updateEmployee = (
  employeeId: string,
  companyId: string,
  data: object,
  citizenId: string,
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/company/${companyId}/${employeeId}/UPDATE`, "PUT", {
      ...data,
      citizenId,
    });

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_EMPLOYEE,
        employees: res.data.employees,
      });
      window.location.href = `/company/${citizenId}/${companyId}/manage`;
    }
  } catch (e) {
    Logger.error(UPDATE_EMPLOYEE, e);
  }
};

export const fireEmployee = (employeeId: string, companyId: string, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/company/${companyId}/${employeeId}/FIRE`, "PUT", {
      citizenId,
    });

    if (isSuccess(res)) {
      dispatch({
        type: FIRE_EMPLOYEE,
        employees: res.data.employees,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: lang.citizen.company.fired_em, type: "success" },
      });
    }
  } catch (e) {
    Logger.error(FIRE_EMPLOYEE, e);
  }
};

export const updateEmployeeStatus = (
  employeeId: string,
  companyId: string,
  citizenId: string,
  type: "ACCEPT" | "DECLINE",
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/company/${companyId}/${employeeId}/${type}`, "PUT", {
      citizenId,
    });

    if (isSuccess(res)) {
      dispatch({
        type: type === "ACCEPT" ? ACCEPT_EMPLOYEE : DECLINE_EMPLOYEE,
        employees: res.data.employees,
      });
      dispatch({
        type: SET_MESSAGE,
        message: {
          msg: type === "ACCEPT" ? lang.citizen.company.accepted : lang.citizen.company.declined,
          type: "success",
        },
      });
    }
  } catch (e) {
    Logger.error(`${ACCEPT_EMPLOYEE} | ${DECLINE_EMPLOYEE}`, e);
  }
};
