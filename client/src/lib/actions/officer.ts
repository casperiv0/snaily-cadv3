import Department from "../../interfaces/Department";
import Officer from "../../interfaces/Officer";
import Logger from "../Logger";
import socket from "../socket";
import lang from "../../language.json";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import {
  GET_CURRENT_OFFICER_STATUS,
  SET_STATUS,
  GET_MY_OFFICERS,
  DELETE_OFFICER_BY_ID,
  CREATE_OFFICER,
  CREATE_OFFICER_ERROR,
  GET_DEPARTMENTS,
  NAME_SEARCH,
  PLATE_SEARCH,
  SET_MESSAGE,
  WEAPON_SEARCH,
  CREATE_WRITTEN_WARNING,
  CREATE_WRITTEN_WARNING_ERROR,
  CREATE_ARREST_REPORT_ERROR,
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
  message?: string;
}

export const getCurrentOfficer = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
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
  status2: string,
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

export const createOfficer = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
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

export const deleteOfficer = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/officer/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_OFFICER_BY_ID,
        officers: res.data.officers,
      });
      dispatch({
        type: SET_MESSAGE,
        message: `${lang.officers.delete_officer_success}`,
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

export const searchPlate = (plate: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/search/plate", "POST", { plate });

    if (isSuccess(res)) {
      dispatch({
        type: PLATE_SEARCH,
        search: res.data.plate,
      });
    }
  } catch (e) {
    Logger.error(PLATE_SEARCH, e);
  }
};

export const searchName = (name: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/search/name", "POST", { name });

    if (isSuccess(res)) {
      dispatch({
        type: NAME_SEARCH,
        search: res.data,
      });
    }
  } catch (e) {
    Logger.error(NAME_SEARCH, e);
  }
};

export const weaponSearch = (serialNumber: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/search/weapon", "POST", { serialNumber });

    if (isSuccess(res)) {
      dispatch({
        type: WEAPON_SEARCH,
        search: res.data.weapon,
      });
    }
  } catch (e) {
    Logger.error(WEAPON_SEARCH, e);
  }
};

export const createWrittenWarning = (data: {
  name: string;
  officer_name: string;
  infractions: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/create-written-warning", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WRITTEN_WARNING,
      });
      dispatch({
        type: SET_MESSAGE,
        message: `${lang.record.created_warning} ${data.name}`,
      });
    } else {
      dispatch({
        type: CREATE_WRITTEN_WARNING_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_WRITTEN_WARNING, e);
  }
};
