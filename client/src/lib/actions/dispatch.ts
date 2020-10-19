import { Dispatch } from "react";
import Call from "../../interfaces/Call";
import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import Logger from "../Logger";
import { handleRequest, isSuccess } from "../functions";
import { GET_ACTIVE_UNITS } from "../types";

interface IDispatch {
  type: string;
  officers?: Officer[];
  ems_fd?: Deputy[];
  calls?: Call[];
}

export const getActiveUnits = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/dispatch/active-units", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ACTIVE_UNITS,
        ems_fd: res.data.ems_fd,
        officers: res.data.officers,
      });
    }
  } catch (e) {
    Logger.error("GET_ACTIVE_UNITS", e);
  }
};
