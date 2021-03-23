import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import { GET_AOP, UPDATE_AOP, GET_CAD_INFO } from "../types";
import Logger from "../Logger";
import socket from "../socket";

interface IDispatch {
  type: string;
  aop?: string;
  cadInfo?: string;
}

export const getCadInfo = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/global/cad-info", "POST");
    const featuresRes = await handleRequest("/global/cad-features", "GET");

    dispatch({
      type: GET_CAD_INFO,
      cadInfo: {
        ...res.data.cadInfo,
        features: featuresRes.data.features,
      },
    });

    if (isSuccess(res)) {
      dispatch({
        type: GET_AOP,
        aop: res.data.cadInfo.AOP,
      });

      if (res.data.cadInfo.version) {
        const { version, updatedVersion } = res.data.cadInfo;
        Logger.log(
          "VERSION",
          `

- Your version: ${version}
- Updated version: ${updatedVersion}`,
        );
      }
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
