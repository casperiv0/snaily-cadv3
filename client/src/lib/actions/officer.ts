import Department from "../../interfaces/Department";
import Officer, { OfficerLog } from "../../interfaces/Officer";
import Logger from "../Logger";
import socket from "../socket";
import lang from "../../language.json";
import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import {
  GET_CURRENT_OFFICER_STATUS,
  SET_STATUS,
  GET_MY_OFFICERS,
  DELETE_OFFICER_BY_ID,
  CREATE_OFFICER,
  NAME_SEARCH,
  PLATE_SEARCH,
  WEAPON_SEARCH,
  SAVE_NOTE,
  GET_MY_OFFICER_LOGS,
  REMOVE_RECORD,
  GET_DEPARTMENTS,
  SOCKET_EVENTS,
} from "../types";
import PenalCode from "../../interfaces/PenalCode";
import Bolo from "../../interfaces/Bolo";

interface IDispatch {
  type: string;
  status?: string;
  status2?: string;
  activeOfficer?: Officer;
  officers?: Officer[];
  departments?: Department[];
  error?: string;
  search?: object;
  penalCodes?: PenalCode[];
  names?: string[];
  logs?: OfficerLog[];
  bolos?: Bolo[];
}

export const getCurrentOfficer = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const id = localStorage.getItem("on-duty-officerId");
    const res = await handleRequest(`/officer/status/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CURRENT_OFFICER_STATUS,
        status: res.data.officer?.status || "off-duty",
        status2: res.data.officer?.status2 || "-",
        activeOfficer: res.data.officer?.status !== "off-duty" ? res.data.officer : null,
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
    localStorage.setItem("on-duty-officerId", id);
    const data = { status: status, status2: status2 };
    const res = await handleRequest(`/officer/status/${id}`, "PUT", {
      ...data,
      timeMs: Date.now(),
    });

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_ACTIVE_UNITS);

      dispatch({
        type: SET_STATUS,
        status: res.data.officer.status,
        status2: res.data.officer.status2,
      });

      notify.success(
        `Successfully updated status to ${status2.startsWith("----") ? status : status2}`,
        {
          autoClose: 2000,
        },
      );
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

export const getMyOfficerLogs = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/my-logs", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MY_OFFICER_LOGS,
        logs: res.data.logs,
      });
    }
  } catch (e) {
    Logger.error(GET_MY_OFFICERS, e);
  }
};

export const createOfficer = (data: Record<string, unknown>) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/officer/my-officers", "POST", data);

    if (isSuccess(res)) {
      dispatch({ type: CREATE_OFFICER, officers: res.data.officers });

      notify.success(`${lang.officers.create_officer_success} ${data.name}`);
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_OFFICER, e);
    return false;
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

      notify.success(lang.officers.delete_officer_success);
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

export const saveNote = (citizenId: string, note: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/officer/note/${citizenId}`, "POST", { note });

    if (!isSuccess(res)) {
      dispatch({
        type: SAVE_NOTE,
      });

      notify.success("Successfully added note");
    }
  } catch (e) {
    Logger.error(SAVE_NOTE, e);
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

export const searchNames = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/officer/search/names", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: "SEARCH_NAMES",
        names: res.data.names,
      });
    }
  } catch (e) {
    Logger.error("SEARCH_NAMES", e);
  }
};

export const suspendLicense = (type: string, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/officer/suspend-license/${citizenId}`, "PUT", {
      type,
    });

    if (isSuccess(res)) {
      dispatch({
        type: "SUSPEND_LICENSE",
      });

      notify.success("Successfully suspended license.");
    }
  } catch (e) {
    Logger.error("SUSPEND_LICENSE", e);
  }
};

export const deleteRecordById = (id: string, type: string, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/records/${type}/${id}/${citizenId}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: NAME_SEARCH,
        search: res.data,
      });

      const msg =
        type === "ticket"
          ? "ticket"
          : type === "arrest_report"
          ? "arrest report"
          : "written warning";
      notify.success(`Successfully removed ${msg}.`);
    }
  } catch (e) {
    Logger.error(REMOVE_RECORD, e);
  }
};
