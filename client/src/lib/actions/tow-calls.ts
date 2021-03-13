import Logger from "../Logger";
import lang from "../../language.json";
import { Dispatch } from "react";
import { CREATE_TOW_CALL, GET_TOW_CALLS, END_TOW_CALL } from "../types";
import { handleRequest, isSuccess, notify } from "../functions";
import socket from "../socket";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  message?: Message;
  calls?: object;
}

export const getTowCalls = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/tow-calls", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_TOW_CALLS,
        calls: res.data.calls,
      });
    }
  } catch (e) {
    Logger.error(GET_TOW_CALLS, e);
  }
};

export const createTowCall = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/tow-calls", "POST", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_TOW_CALLS");
      dispatch({
        type: CREATE_TOW_CALL,
        calls: res.data.calls,
      });

      notify(lang.citizen.tow_call_created).success();
    }
  } catch (e) {
    Logger.error(CREATE_TOW_CALL, e);
  }
};

export const endTowCall = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/tow-calls/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: END_TOW_CALL,
        calls: res.data.calls,
      });

      notify(lang.tow.end_success).success();
    }
  } catch (e) {
    Logger.error(END_TOW_CALL, e);
  }
};
