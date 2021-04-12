import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest } from "@lib/utils";
import { GetCadInfo, UpdateAop } from "./GlobalTypes";
import { socket } from "@lib/socket.client";
import { SocketEvents } from "types/Socket";

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
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const updateAop = (newAop: string) => async (dispatch: Dispatch<UpdateAop>) => {
  try {
    const res = await handleRequest("/global/cad-info/aop", "POST", {
      aop: newAop,
    });

    socket.emit(SocketEvents.UpdateAop, newAop);
    dispatch({
      type: "UPDATE_AOP",
      aop: res.data.aop,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
