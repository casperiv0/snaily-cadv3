import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { IBolos } from "./BoloTypes";
import lang from "src/language.json";
import { socket } from "@lib/socket.client";

export const getBolos = (headers?: any) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest("/bolos", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_BOLOS",
      bolos: res.data.bolos,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.error(error);
  }
};

export const deleteBolo = (id: string) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest(`/bolos/${id}`, "DELETE");

    dispatch({
      type: "DELETE_BOLO",
      bolos: res.data.bolos,
    });

    return notify.success(lang.bolos.removed_bolo);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const createBolo = (data: RequestData) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest("/bolos", "POST", data);

    dispatch({
      type: "CREATE_BOLO",
      bolos: res.data.bolos,
    });
    socket.emit("UPDATE_BOLOS");

    return notify.success(lang.bolos.add_bolo);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
