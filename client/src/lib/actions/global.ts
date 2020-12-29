import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import { GET_AOP, UPDATE_AOP, GET_CAD_INFO, SET_MESSAGE } from "../types";
import Logger from "../Logger";
import socket from "../socket";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  aop?: string;
  cadInfo?: string;
  message?: Message | null;
}

export const getCadInfo = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/global/cad-info", "POST");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CAD_INFO,
        cadInfo: res.data.cadInfo,
      });
      dispatch({
        type: GET_AOP,
        aop: res.data.cadInfo.AOP,
      });
    }
  } catch (e) {
    Logger.error("GET_CAD_INFO", e);
  }
};

export const updateAop = (aop: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/global/update-aop", "POST", { aop });

    if (isSuccess(res)) {
      socket.emit("UPDATE_AOP", aop);
      dispatch({
        type: UPDATE_AOP,
        aop: aop,
      });
    }
  } catch (e) {
    Logger.error(UPDATE_AOP, e);
  }
};

export const dismissMessage = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({
    type: SET_MESSAGE,
    message: null,
  });
};
