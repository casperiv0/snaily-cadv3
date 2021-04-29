import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { CallTypes, CreateCall, GetCalls } from "./CallTypes";
import { socket } from "@hooks/useSocket";
import { SocketEvents } from "types/Socket";
import lang from "src/language.json";
import { Call } from "types/Call";

function updateCalls(type: CallTypes, callData: Call | null) {
  switch (type) {
    case "911": {
      socket.emit(SocketEvents.Update911Calls);
      socket.emit(SocketEvents.New911Call, callData);
      break;
    }
    case "tow": {
      socket.emit(SocketEvents.UpdateTowCalls);
      break;
    }

    case "taxi": {
      socket.emit(SocketEvents.UpdateTaxiCalls);
      break;
    }
    default: {
      break;
    }
  }
}

export const createCall = (type: CallTypes, data: RequestData, shouldNotify = false) => async (
  dispatch: Dispatch<CreateCall>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/calls/${type}`, "POST", data);

    dispatch({
      type: "CREATE_CALL",
      calls: res.data.calls,
    });

    updateCalls(type, (data as unknown) as Call);
    if (shouldNotify) {
      const msg =
        type === "911"
          ? lang.citizen.call_created
          : type === "taxi"
          ? lang.taxi.created_call
          : lang.tow.created_call;

      notify.success(msg);
    }
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

    updateCalls(type, null);
    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
