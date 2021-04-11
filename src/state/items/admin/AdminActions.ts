import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Code10 } from "types/Code10";
import { PenalCode } from "types/PenalCode";
import { I10Codes, IPenalCodes } from "./AdminTypes";

export const get10Codes = (cookie?: string) => async (dispatch: Dispatch<I10Codes>) => {
  try {
    const res = await handleRequest("/admin/10-codes", "GET", { cookie });

    dispatch({
      type: "GET_10_CODES",
      codes: res.data.codes,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const add10Code = (data: Partial<Code10>) => async (dispatch: Dispatch<I10Codes>) => {
  try {
    const res = await handleRequest("/admin/10-codes", "POST", data);

    dispatch({
      type: "GET_10_CODES",
      codes: res.data.codes,
    });

    return notify.success("Successfully added 10 code");
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    return notify.warn(error);
  }
};

export const update10Code = (id: string, data: Partial<Code10>) => async (
  dispatch: Dispatch<I10Codes>,
) => {
  try {
    const res = await handleRequest(`/admin/10-codes/${id}`, "PUT", data);

    dispatch({
      type: "GET_10_CODES",
      codes: res.data.codes,
    });

    return notify.success("Successfully updated 10 code");
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    return notify.warn(error);
  }
};

export const delete10Code = (id: string) => async (dispatch: Dispatch<I10Codes>) => {
  try {
    const res = await handleRequest(`/admin/10-codes/${id}`, "DELETE");

    dispatch({
      type: "DELETE_10_CODE",
      codes: res.data.codes,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getPenalCodes = (cookie?: string) => async (dispatch: Dispatch<IPenalCodes>) => {
  try {
    const res = await handleRequest("/admin/penal-codes", "GET", { cookie });

    dispatch({
      type: "GET_PENAL_CODES",
      penalCodes: res.data.penalCodes,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const updatePenalCode = (id: string, data: Partial<PenalCode>) => async (
  dispatch: Dispatch<IPenalCodes>,
) => {
  try {
    const res = await handleRequest(`/admin/penal-codes/${id}`, "PUT", data);

    dispatch({
      type: "UPDATE_PENAL_CODE",
      penalCodes: res.data.penalCodes,
    });

    return notify.success("Successfully updated penal code");
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    return notify.warn(error);
  }
};

export const addPenalCode = (data: Partial<PenalCode>) => async (
  dispatch: Dispatch<IPenalCodes>,
) => {
  try {
    const res = await handleRequest("/admin/penal-codes", "POST", data);

    dispatch({
      type: "GET_PENAL_CODES",
      penalCodes: res.data.penalCodes,
    });

    return notify.success("Successfully added penal code");
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    return notify.warn(error);
  }
};

export const deletePenalCode = (id: string) => async (dispatch: Dispatch<IPenalCodes>) => {
  try {
    const res = await handleRequest(`/admin/penal-codes/${id}`, "DELETE");

    dispatch({
      type: "DELETE_PENAL_CODE",
      penalCodes: res.data.penalCodes,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
