import { handleRequest, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { CallTypes, CreateCall } from "./CallTypes";

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
    console.error(e);
    return false;
  }
};
