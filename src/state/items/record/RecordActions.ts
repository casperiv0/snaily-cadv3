import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { ArrestReport, Ticket, Warrant, WrittenWarning } from "types/Record";
import { IRecord } from "./RecordTypes";
import lang from "src/language.json";

export const createWarrant = (data: Omit<Warrant, "id">) => async (
  dispatch: Dispatch<IRecord>,
): Promise<boolean> => {
  try {
    await handleRequest("/record/create-warrant", "POST", (data as unknown) as RequestData);

    dispatch({
      type: "CREATE_WARRANT",
    });

    return notify.success(`${lang.record.created_warrant} ${data.name}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const createWrittenWarning = (
  data: Omit<WrittenWarning, "id" | "citizen_id" | "user_id" | "date">,
) => async (dispatch: Dispatch<IRecord>): Promise<boolean> => {
  try {
    await handleRequest("/record/create-written-warning", "POST", (data as unknown) as RequestData);

    dispatch({
      type: "CREATE_WRITTEN_WARNING",
    });

    return notify.success(`${lang.record.created_warning} ${data.name}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const creatArrestReport = (
  data: Omit<ArrestReport, "id" | "citizen_id" | "user_id" | "date">,
) => async (dispatch: Dispatch<IRecord>): Promise<boolean> => {
  try {
    await handleRequest("/record/create-arrest-report", "POST", (data as unknown) as RequestData);

    dispatch({
      type: "CREATE_ARREST_REPORT",
    });

    return notify.success(`${lang.record.created_arrest_report} ${data.name}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const createTicket = (
  data: Omit<Ticket, "id" | "citizen_id" | "user_id" | "date">,
) => async (dispatch: Dispatch<IRecord>): Promise<boolean> => {
  try {
    await handleRequest("/record/create-ticket", "POST", (data as unknown) as RequestData);

    dispatch({
      type: "CREATE_TICKET",
    });

    return notify.success(`${lang.record.created_ticket} ${data.name}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
