import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { GetBleetById, IBleeter, UpdateBleetById } from "./BleeterTypes";
import lang from "src/language.json";

export const getBleets = (headers?: any) => async (dispatch: Dispatch<IBleeter>) => {
  try {
    const res = await handleRequest("/bleeter", "GET", {
      cookie: headers.cookie,
      url: headers.host,
    });

    dispatch({
      type: "GET_BLEETS",
      bleets: res.data.bleets,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getBleetById = (id: string, headers?: any) => async (
  dispatch: Dispatch<GetBleetById>,
) => {
  try {
    const res = await handleRequest(`/bleeter/${id}`, "GET", {
      cookie: headers.cookie,
      url: headers.host,
    });

    dispatch({
      type: "GET_BLEET_BY_ID",
      bleet: res.data.bleet ?? null,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const updateBleet = (id: string, data: RequestData) => async (
  dispatch: Dispatch<UpdateBleetById>,
) => {
  try {
    const res = await handleRequest(`/bleeter/${id}`, "PUT", data);

    dispatch({
      type: "UPDATE_BLEET_BY_ID",
      bleet: res.data.bleet,
    });

    return notify.success(lang.bleeter.update_bleet_success);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const deleteBleet = (id: string) => async (dispatch: Dispatch<any>) => {
  try {
    await handleRequest(`/bleeter/${id}`, "DELETE");

    dispatch({
      type: "DELETE_BLEET_BY_ID",
    });

    return notify.success("Successfully deleted bleet");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const createBleet = (data: { title: string; body: string; image: any }) => async (
  dispatch: Dispatch<IBleeter>,
) => {
  try {
    const fd = new FormData();

    if (data.image) {
      fd.append("image", data.image, data.image?.name);
    }
    fd.append("title", data.title);
    fd.append("body", data.body);

    const res = await handleRequest("/bleeter", "POST", (fd as unknown) as RequestData);

    dispatch({
      type: "CREATE_BLEET",
      bleets: res.data.bleets,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
