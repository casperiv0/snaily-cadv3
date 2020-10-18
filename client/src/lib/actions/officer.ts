import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import socket from "../socket";
import { GET_CURRENT_OFFICER_STATUS, SET_STATUS, SET_ON_DUTY } from "../types";

interface IDispatch {
  type: string;
  status?: string;
  status2?: string;
  officerName?: string;
}

export const getCurrentOfficer = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/officer/status/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CURRENT_OFFICER_STATUS,
        status: res.data.officer.status,
        status2: res.data.officer.status2,
        officerName: res.data.officer.officerName,
      });
    }
  } catch (e) {
    Logger.error("GET_CURRENT_OFFICER", e);
  }
};

export const setStatus = (id: string, status: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const data = { status: "on-duty", status2: status };
    const res = await handleRequest(`/officer/status/${id}`, "PUT", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_ACTIVE_UNITS")
      dispatch({
        type: SET_STATUS,
        status: res.data.officer.status,
        status2: res.data.officer.status2,
        officerName: res.data.officer.officerName,
      });
    }
  } catch (e) {
    Logger.error(SET_STATUS, e);
  }
};
