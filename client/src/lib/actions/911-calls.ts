import Call from "../../interfaces/Call";
import Logger from "../Logger";
import socket from "../socket";
import lang from "../../language.json";
import { Dispatch } from "redux";
import { handleRequest, isSuccess, notify } from "../functions";
import { GET_911_CALLS, END_911_CALL, UPDATE_911_CALL, CREATE_911_CALL } from "../types";

interface IDispatch {
  type: string;
  calls?: Call[];
}

export const getActive911Calls = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/global/911-calls", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_911_CALLS,
        calls: res.data.calls,
      });
    }
  } catch (e) {
    Logger.error("GET_ACTIVE_911_CALLS", e);
  }
};

export const create911Call = (data: object) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/global/911-calls", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_911_CALL,
        calls: res.data.calls,
      });

      notify(lang.citizen.call_created).success();
      socket.emit("UPDATE_911_CALLS");
      socket.emit("NEW_911_CALL", data);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_911_CALL, e);
    return false;
  }
};

export const update911Call = (id: string, data: Partial<Call>) => async () => {
  try {
    const res = await handleRequest(`/dispatch/calls/${id}`, "PUT", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_911_CALLS");
      socket.emit(
        "UPDATE_ASSIGNED_UNITS",
        data.assigned_unit?.map((u) => u.value),
      );
    }
  } catch (e) {
    Logger.error(UPDATE_911_CALL, e);
  }
};

export const end911Call = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/dispatch/calls/${id}`, "DELETE");
    socket.emit("END_911_CALL", id);

    if (isSuccess(res)) {
      socket.emit("UPDATE_911_CALLS");
      dispatch({ type: END_911_CALL, calls: res.data.calls });
    }
  } catch (e) {
    Logger.error(END_911_CALL, e);
  }
};
