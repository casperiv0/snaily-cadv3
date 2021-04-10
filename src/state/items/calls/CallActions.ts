import { getErrorFromResponse, handleRequest, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { CallTypes, CreateCall, GetCalls } from "./CallTypes";

export const createCall = (type: CallTypes, data: RequestData) => async (
  dispatch: Dispatch<CreateCall>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/calls/${type}`, "POST", data);

    dispatch({
      type: "CREATE_CALL",
      calls: res.data.calls,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
    return false;
  }
};

export const getCalls = (type: CallTypes, cookie?: string) => async (
  dispatch: Dispatch<GetCalls>,
) => {
  try {
    const res = await handleRequest(`/calls/${type}`, "GET", { cookie });

    dispatch({
      type: "GET_CALLS",
      calls: res.data.calls,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const endCall = (type: CallTypes, id: string) => async (dispatch: Dispatch<GetCalls>) => {
  try {
    const res = await handleRequest(`/calls/${type}/${id}`, "DELETE");

    dispatch({
      type: "GET_CALLS",
      calls: res.data.calls,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
