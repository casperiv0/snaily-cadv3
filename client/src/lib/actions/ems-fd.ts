import Deputy from "../../interfaces/Deputy";
import Logger from "../Logger";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import {
  GET_CURRENT_EMS_STATUS,
  GET_MY_EMS_FD,
  SET_EMS_STATUS,
} from "../types";
import socket from "../socket";

interface IDispatch {
  type: string;
  message?: string;
  error?: string;
  deputies?: Deputy[];
  status?: string;
  status2?: string;
}

export const getMyDeputies = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/ems-fd/my-deputies", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MY_EMS_FD,
        deputies: res.data.deputies,
      });
    }
  } catch (e) {
    Logger.error(GET_MY_EMS_FD, e);
  }
};

export const getCurrentEmsStatus = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/ems-fd/status/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CURRENT_EMS_STATUS,
        status: res.data.deputy?.status || "off-duty",
        status2: res.data.deputy?.status2 || "-",
      });
    }
  } catch (e) {
    Logger.error(GET_CURRENT_EMS_STATUS, e);
  }
};

export const setStatus = (
  id: string,
  status: "on-duty" | "off-duty" | string,
  status2: string
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const data = { id, status, status2 };
    const res = await handleRequest(`/ems-fd/status/${id}`, "PUT", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_ACTIVE_UNITS");
      localStorage.setItem("on-duty-ems-fd", id);
      dispatch({
        type: SET_EMS_STATUS,
        status: res.data.deputy.status,
        status2: res.data.deputy.status2,
      });
    }
  } catch (e) {
    Logger.error(SET_EMS_STATUS, e);
  }
};
