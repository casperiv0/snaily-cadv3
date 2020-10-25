import { Dispatch } from "react";
import Department from "../../interfaces/Department";
import Officer from "../../interfaces/Officer";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import socket from "../socket";
import {
  GET_CURRENT_OFFICER_STATUS,
  SET_STATUS,
  GET_MY_OFFICERS,
  DELETE_OFFICER_BY_ID,
  CREATE_OFFICER,
  CREATE_OFFICER_ERROR,
  GET_DEPARTMENTS,
  SEARCH,
} from "../types";

interface IDispatch {
  type: string;
  status?: string;
  status2?: string;
  officerName?: string;
  officers?: Officer[];
  departments?: Department[];
  error?: string;
  search?: object;
}

export const getCurrentOfficer = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/officer/status/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CURRENT_OFFICER_STATUS,
        status: res.data.officer?.status || "off-duty",
        status2: res.data.officer?.status2 || "-",
        officerName: res.data.officer?.officerName || "-",
      });
    }
  } catch (e) {
    Logger.error("GET_CURRENT_OFFICER", e);
  }
};

export const setStatus = (
  id: string,
  status: "on-duty" | "off-duty" | string,
  status2: string
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const data = { status: status, status2: status2 };
    const res = await handleRequest(`/officer/status/${id}`, "PUT", data);

    if (isSuccess(res)) {
      localStorage.setItem("on-duty-officerId", id);
      dispatch({
        type: SET_STATUS,
        status: res.data.officer.status,
        status2: res.data.officer.status2,
        officerName: res.data.officer.officerName,
      });
      socket.emit("UPDATE_ACTIVE_UNITS");
    }
  } catch (e) {
    Logger.error(SET_STATUS, e);
  }
};

export const getMyOfficers = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/my-officers", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MY_OFFICERS,
        officers: res.data.officers,
      });
    }
  } catch (e) {
    Logger.error(GET_MY_OFFICERS, e);
  }
};

export const createOfficer = (data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/officer/my-officers", "POST", data);

    if (isSuccess(res)) {
      dispatch({ type: CREATE_OFFICER });
      window.location.href = "/leo/my-officers";
    } else {
      dispatch({ type: CREATE_OFFICER_ERROR, error: res.data.error });
    }
  } catch (e) {
    Logger.error(CREATE_OFFICER, e);
  }
};

export const deleteOfficer = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/officer/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_OFFICER_BY_ID,
        officers: res.data.officers,
      });
    }
  } catch (e) {
    Logger.error(DELETE_OFFICER_BY_ID, e);
  }
};

export const getDepartments = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/departments", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_DEPARTMENTS,
        departments: res.data.departments,
      });
    }
  } catch (e) {
    Logger.error(GET_DEPARTMENTS, e);
  }
};

export const searchPlate = (plate: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/officer/search/plate", "POST", { plate });

    if (isSuccess(res)) {
      dispatch({
        type: SEARCH,
        search: res.data.plate,
      });
    }
  } catch (e) {
    Logger.error(SEARCH, e);
  }
};

export const searchName = (name: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/officer/search/name", "POST", { name });

    if (isSuccess(res)) {
      dispatch({
        type: SEARCH,
        search: res.data.citizen,
      });
    }
  } catch (e) {
    Logger.error(SEARCH, e);
  }
};
