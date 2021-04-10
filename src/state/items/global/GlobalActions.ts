import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest } from "@lib/utils";
import { GetCadInfo, UpdateAop } from "./GlobalTypes";

export const getCadInfo = (cookie?: string) => async (dispatch: Dispatch<GetCadInfo>) => {
  try {
    const res = await handleRequest("/global/cad-info", "POST", {
      cookie,
    });

    dispatch({
      type: "GET_CAD_INFO",
      cadInfo: res.data.cad,
    });

    // TODO: add version logger
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

    // TOdo: socket.emit -> updateAOP
    dispatch({
      type: "UPDATE_AOP",
      aop: res.data.aop,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
