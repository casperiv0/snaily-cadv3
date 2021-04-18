import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { CreateTruckLog, GetTruckLogs, DeleteTruckLog } from "./TruckLogTypes";

export const getTruckLogs = (headers?: any) => async (dispatch: Dispatch<GetTruckLogs>) => {
  try {
    const res = await handleRequest("/truck-logs", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_TRUCK_LOGS",
      logs: res.data.logs,
    });
  } catch (e) {
    return false;
  }
};

export const createTruckLog = (data: RequestData) => async (dispatch: Dispatch<CreateTruckLog>) => {
  try {
    const res = await handleRequest("/truck-logs", "POST", data);

    dispatch({
      type: "CREATE_TRUCK_LOG",
      logs: res.data.logs,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.warn(error);

    return false;
  }
};

export const deleteTruckLog = (id: string) => async (dispatch: Dispatch<DeleteTruckLog>) => {
  try {
    const res = await handleRequest(`/truck-logs/${id}`, "DELETE");

    dispatch({
      type: "DELETE_TRUCK_LOG",
      logs: res.data.logs,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.warn(error);

    return false;
  }
};
