import Logger from "../Logger";
import { Dispatch } from "react";
import { CREATE_TAXI_CALL, SET_MESSAGE, GET_TAXI_CALLS } from "../types";
import { handleRequest, isSuccess } from "../functions";
import socket from "../socket";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  message?: Message;
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
      socket.emit("UPDATE_TAXI_CALLS");
      dispatch({
        type: CREATE_TAXI_CALL,
        calls: res.data.calls,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: "Successfully called the Taxi service", type: "success" },
      });
    }
  } catch (e) {
    Logger.error(CREATE_TAXI_CALL, e);
  }
};
