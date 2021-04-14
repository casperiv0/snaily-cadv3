import { socket } from "@hooks/useSocket";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { Deputy } from "types/Deputy";
import { SocketEvents } from "types/Socket";
import { IEmsFd, SetEmsFdStatus } from "./EmsFdTypes";

export const getEmsFdDeputies = (headers?: any) => async (dispatch: Dispatch<IEmsFd>) => {
  try {
    const res = await handleRequest("/ems-fd", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_DEPUTIES",
      deputies: res.data.deputies,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const createEmsFdDeputy = (data: RequestData) => async (dispatch: Dispatch<IEmsFd>) => {
  try {
    const res = await handleRequest("/ems-fd", "POST", data);

    dispatch({
      type: "CREATE_DEPUTY",
      deputies: res.data.deputies,
    });

    return notify.success("Successfully created EMS/FD member");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const setEmsStatus = (deputy: Pick<Deputy, "status" | "status2" | "id">) => async (
  dispatch: Dispatch<SetEmsFdStatus>,
) => {
  try {
    const res = await handleRequest("/ems-fd/status", "PUT", deputy);

    dispatch({
      type: "SET_EMS_FD_STATUS",
      deputy: res.data.deputy,
    });

    socket.emit(SocketEvents.UpdateActiveUnits);

    return notify.success(`Successfully updated status to ${deputy.status2}`, {
      autoClose: 2000,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
