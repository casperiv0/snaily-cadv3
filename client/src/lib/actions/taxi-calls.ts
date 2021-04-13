import Logger from "../Logger";
import { Dispatch } from "react";
import { CREATE_TAXI_CALL, GET_TAXI_CALLS, END_TAXI_CALL, SOCKET_EVENTS } from "../types";
import { handleRequest, isSuccess, notify } from "../functions";
import socket from "../socket";

interface IDispatch {
  type: string;
  calls?: object;
}

export const getTaxiCalls = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/taxi-calls", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_TAXI_CALLS,
        calls: res.data.calls,
      });
    }
  } catch (e) {
    Logger.error(GET_TAXI_CALLS, e);
  }
};

export const createTaxiCall = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/taxi-calls", "POST", data);

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_TAXI_CALLS);
      dispatch({
        type: CREATE_TAXI_CALL,
        calls: res.data.calls,
      });

      notify.success("Successfully called the Taxi Service");
    }
  } catch (e) {
    Logger.error(CREATE_TAXI_CALL, e);
  }
};

export const endTaxiCall = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/taxi-calls/${id}`, "DELETE");

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_TAXI_CALLS);
      dispatch({
        type: END_TAXI_CALL,
        calls: res.data.calls,
      });
    }
  } catch (e) {
    Logger.error(END_TAXI_CALL, e);
  }
};
