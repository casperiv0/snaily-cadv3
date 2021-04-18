import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { GetCadInfo, UpdateAop } from "./GlobalTypes";
import { socket } from "@hooks/useSocket";
import { SocketEvents } from "types/Socket";
import lang from "src/language.json";

export const getCadInfo = (headers?: any) => async (dispatch: Dispatch<GetCadInfo>) => {
  try {
    const res = await handleRequest("/global/cad-info", "POST", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_CAD_INFO",
      cadInfo: res.data.cad,
    });
  } catch (e) {
    return false;
  }
};

export const updateAop = (newAop: string) => async (dispatch: Dispatch<UpdateAop>) => {
  try {
    const res = await handleRequest("/global/cad-info/aop", "PUT", {
      aop: newAop,
    });

    socket.emit(SocketEvents.UpdateAop, newAop);
    dispatch({
      type: "UPDATE_AOP",
      aop: res.data.aop,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const updateCadSettings = (data: RequestData) => async (dispatch: Dispatch<GetCadInfo>) => {
  try {
    const res = await handleRequest("/global/cad-info", "PUT", data);

    socket.emit(SocketEvents.UpdateAop, data.aop);
    dispatch({
      type: "UPDATE_CAD_SETTINGS",
      cadInfo: res.data.cad,
    });

    return notify.success(lang.admin.cad_settings.updated);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
