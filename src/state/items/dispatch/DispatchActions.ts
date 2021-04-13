import { IUnits } from "@actions/admin/AdminTypes";
import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Call } from "types/Call";
import { AddressSearch } from "./DispatchTypes";

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
  dispatch: Dispatch<any>,
) => {
  try {
    await handleRequest(`/dispatch/calls/${callId}`, "PUT", data);

    dispatch({
      type: "ADD_CALL_EVENT",
    });

    if (shouldNotify) {
      notify.success("Successfully added event");
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

export const getActiveUnits = (headers?: any) => async (dispatch: Dispatch<IUnits>) => {
  try {
    const res = await handleRequest("/dispatch/units", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_ALL_UNITS",
      ems_fd: res.data.ems_fd,
      officers: res.data.officers,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
