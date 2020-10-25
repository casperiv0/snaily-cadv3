import TruckLog from "../../interfaces/TruckLog";
import Logger from "../Logger";
import { Dispatch } from "react";
import {
  CREATE_TRUCK_LOG,
  CREATE_TRUCK_LOG_ERROR,
  DELETE_TRUCK_LOG,
  GET_TRUCK_LOGS,
} from "../types";
import { handleRequest, isSuccess } from "../functions";

interface IDispatch {
  type: string;
  logs?: TruckLog[];
  message?: string;
  error?: string;
}

export const getTruckLogs = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/truck-logs", "GET");
    if (isSuccess(res)) {
      dispatch({
        type: GET_TRUCK_LOGS,
        logs: res.data.logs,
      });
    }
  } catch (e) {
    Logger.error(GET_TRUCK_LOGS, e);
  }
};

export const createTruckLog = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/truck-logs", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_TRUCK_LOG,
      });
      return (window.location.href = "/truck-logs");
    } else {
      dispatch({
        type: CREATE_TRUCK_LOG_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_TRUCK_LOG, e);
  }
};

export const deleteTruckLog = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/truck-logs/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_TRUCK_LOG,
        logs: res.data.logs,
      });
    }
  } catch (e) {
    Logger.error(DELETE_TRUCK_LOG, e);
  }
};
