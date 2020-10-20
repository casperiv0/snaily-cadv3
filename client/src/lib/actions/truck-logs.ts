import TruckLog from "../../interfaces/TruckLog";
import Logger from "../Logger";
import { Dispatch } from "react";
import { DELETE_TRUCK_LOG, GET_TRUCK_LOGS } from "../types";
import { handleRequest, isSuccess } from "../functions";

interface IDispatch {
  type: string;
  logs?: TruckLog[];
  message?: string;
}

export const getTruckLogs = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/truck-logs", "GET");
    console.log("here");

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

export const deleteTruckLog = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
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
