import { socket } from "@hooks/useSocket";
import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Officer } from "types/Officer";
import { SocketEvents } from "types/Socket";
import { IOfficer, Search, IOfficers, SearchNames, GetOfficerLogs } from "./OfficerTypes";
import lang from "src/language.json";

export const weaponSearch = (serialNumber: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/weapon", "POST", { serialNumber });

    dispatch({
      type: "WEAPON_SEARCH",
      search: res.data.weapon,
      searchType: "weapon",
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const nameSearch = (name: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/name", "POST", { name });

    dispatch({
      type: "NAME_SEARCH",
      search: res.data,
      searchType: "name",
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const plateSearch = (plate: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/plate", "POST", { plate });

    dispatch({
      type: "PLATE_SEARCH",
      search: res.data.vehicle,
      searchType: "plate",
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getActiveOfficer = (headers?: any) => async (dispatch: Dispatch<IOfficer>) => {
  try {
    const res = await handleRequest("/officer/active-officer", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_ACTIVE_OFFICER",
      activeOfficer: res.data.officer ?? null,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const setStatus = (officer: Pick<Officer, "status" | "status2" | "id">) => async (
  dispatch: Dispatch<IOfficer>,
) => {
  try {
    const res = await handleRequest(`/officer/${officer.id}/status`, "PUT", {
      status: officer.status,
      status2: officer.status2,
      timeMs: Date.now(),
    });

    dispatch({
      type: "SET_STATUS",
      activeOfficer: res.data.officer ?? null,
    });

    socket.emit(SocketEvents.UpdateActiveUnits);
    return notify.success(
      `Successfully updated status to ${
        officer.status2.startsWith("----") ? officer.status : officer.status2
      }`,
      {
        autoClose: 2000,
      },
    );
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getMyOfficers = (headers?: any) => async (dispatch: Dispatch<IOfficers>) => {
  try {
    const res = await handleRequest("/officer", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_MY_OFFICERS",
      officers: res.data.officers,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getMyOfficerLogs = (headers?: any) => async (dispatch: Dispatch<GetOfficerLogs>) => {
  try {
    const res = await handleRequest("/officer/logs", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_MY_OFFICER_LOGS",
      logs: res.data.logs,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const deleteOfficer = (id: string) => async (dispatch: Dispatch<IOfficers>) => {
  try {
    const res = await handleRequest(`/officer/${id}`, "DELETE");

    dispatch({
      type: "DELETE_OFFICER",
      officers: res.data.officers,
    });

    return notify.success(lang.officers.delete_officer_success);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const createOfficer = (data: Partial<Officer>) => async (dispatch: Dispatch<IOfficers>) => {
  try {
    const res = await handleRequest("/officer", "POST", data);

    dispatch({
      type: "CREATE_OFFICER",
      officers: res.data.officers,
    });

    return notify.success(lang.officers.create_officer_success);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const searchNames = () => async (dispatch: Dispatch<SearchNames>) => {
  try {
    const res = await handleRequest("/search/names");

    dispatch({
      type: "SEARCH_NAMES",
      names: res.data.names,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const suspendLicense = (type: string, citizenId: string) => async (
  dispatch: Dispatch<{ type: "SUSPEND_LICENSE" }>,
) => {
  try {
    await handleRequest(`/officer/suspend-license/${citizenId}`, "PUT", {
      type,
    });

    dispatch({
      type: "SUSPEND_LICENSE",
    });

    return notify.success("Successfully suspended license.");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const saveNote = (citizenId: string, note: string) => async (
  dispatch: Dispatch<{ type: "SAVE_NOTE" }>,
) => {
  try {
    await handleRequest(`/officer/note/${citizenId}`, "PUT", { note });

    dispatch({
      type: "SAVE_NOTE",
    });

    return notify.success("Successfully added note");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
