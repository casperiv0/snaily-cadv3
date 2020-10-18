import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import { GET_AOP } from "../types";
import Logger from "../Logger";

interface IDispatch {
  type: string;
  aop?: string;
  cadInfo?: string;
}

export const getCadInfo = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/global/cad-info", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_AOP,
        aop: res.data.cadInfo.AOP,
      });
    }
  } catch (e) {
    Logger.error("GET_CAD_INFO", e);
  }
};
