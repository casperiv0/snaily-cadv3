import { socket } from "@hooks/useSocket";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { Deputy } from "types/Deputy";
import { MedicalRecord } from "types/MedicalRecord";
import { SocketEvents } from "types/Socket";
import { GetActiveDeputy, IEmsFd, SearchMedicalRecords, SetEmsFdStatus } from "./EmsFdTypes";

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

export const getActiveEmsFd = (headers?: any) => async (dispatch: Dispatch<GetActiveDeputy>) => {
  try {
    const res = await handleRequest("/ems-fd/active-deputy", "GET", {
      cookie: headers?.cookie,
      url: headers?.host,
    });

    dispatch({
      type: "GET_ACTIVE_DEPUTY",
      deputy: res.data.deputy ?? null,
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

export const deleteEmsFdDeputy = (id: string) => async (dispatch: Dispatch<IEmsFd>) => {
  try {
    const res = await handleRequest(`/ems-fd/${id}`, "DELETE");

    dispatch({
      type: "DELETE_DEPUTY",
      deputies: res.data.deputies,
    });

    return notify.success("Successfully deleted EMS/FD member");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const setEmsStatus = (deputy: Pick<Deputy, "status" | "status2" | "id">) => async (
  dispatch: Dispatch<SetEmsFdStatus>,
) => {
  try {
    const res = await handleRequest(`/ems-fd/${deputy.id}/status`, "PUT", deputy);

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

export const searchMedicalRecord = (name: string) => async (
  dispatch: Dispatch<SearchMedicalRecords>,
) => {
  try {
    const res = await handleRequest("/search/medical-records", "POST", { name });

    dispatch({
      type: "SEARCH_MEDICAL_RECORDS",
      medicalRecords: res.data.medicalRecords?.map((record: MedicalRecord) => {
        record.citizen = res.data.citizen;

        return record;
      }),
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const declareDeadOrAlive = (citizenId: string, type: "alive" | "dead") => async (
  dispatch: Dispatch<{}>,
) => {
  try {
    await handleRequest(`/ems-fd/declare?citizenId=${citizenId}&type=${type}`, "PUT");

    dispatch({});

    return notify.success(`Successfully declared ${type}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
