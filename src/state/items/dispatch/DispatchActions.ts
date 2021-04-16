import { GetActiveUnits, AddressSearch, GetSteamIds } from "./DispatchTypes";
import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Call } from "types/Call";
import { UpdateCall } from "../calls/CallTypes";

export const addCallEvent = (callId: string, text: string) => async (dispatch: Dispatch<any>) => {
  try {
    await handleRequest(`/dispatch/calls/${callId}/events`, "POST", { text });

    dispatch({
      type: "ADD_CALL_EVENT",
    });

    return notify.success("Successfully added event");
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.warn(error);
  }
};

export const update911Call = (callId: string, data: Partial<Call>, shouldNotify = true) => async (
  dispatch: Dispatch<UpdateCall>,
) => {
  try {
    const res = await handleRequest(`/dispatch/calls/${callId}`, "PUT", data);

    dispatch({
      type: "UPDATE_CALL",
      calls: res.data.calls,
    });

    if (shouldNotify) {
      notify.success("Successfully updated 911 call");
    }

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const addressSearch = (address: string) => async (dispatch: Dispatch<AddressSearch>) => {
  try {
    const res = await handleRequest("/search/address", "POST", { address });

    dispatch({
      type: "ADDRESS_SEARCH",
      search: res.data.results,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getActiveUnits = (headers?: any) => async (dispatch: Dispatch<GetActiveUnits>) => {
  try {
    const res = await handleRequest("/dispatch/units", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_ACTIVE_UNITS",
      ems_fd: res.data.ems_fd,
      officers: res.data.officers,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getSteamIds = (headers?: any) => async (dispatch: Dispatch<GetSteamIds>) => {
  try {
    const res = await handleRequest("/dispatch/steam_ids", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_STEAM_IDS",
      steamIds: res.data.members,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
