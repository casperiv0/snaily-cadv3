import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { CallTypes, CreateCall, GetCalls } from "./CallTypes";
import { socket } from "@hooks/useSocket";
import { SocketEvents } from "types/Socket";

export const createCall = (type: CallTypes, data: RequestData) => async (
  dispatch: Dispatch<CreateCall>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/calls/${type}`, "POST", data);

    dispatch({
      type: "CREATE_CALL",
      calls: res.data.calls,
    });

    socket.emit(SocketEvents.Update911Calls);
    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getCalls = (type: CallTypes, headers?: any) => async (
  dispatch: Dispatch<GetCalls>,
) => {
  try {
    const res = await handleRequest(`/calls/${type}`, "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_CALLS",
      calls: res.data.calls,
    });
  } catch (e) {
    return false;
  }
};

export const endCall = (type: CallTypes, id: string) => async (dispatch: Dispatch<GetCalls>) => {
  try {
    const res = await handleRequest(`/calls/${type}/${id}`, "DELETE");

    dispatch({
      type: "GET_CALLS",
      calls: res.data.calls,
    });

    socket.emit(SocketEvents.Update911Calls);
    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
