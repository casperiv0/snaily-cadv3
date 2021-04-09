import lang from "../../language.json";
import Logger from "../Logger";
import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import {
  CREATE_WARRANT,
  CREATE_WRITTEN_WARNING,
  CREATE_ARREST_REPORT,
  CREATE_TICKET,
} from "../types";

interface IDispatch {
  type: string;
  error?: string;
}

export const createWarrant = (data: {
  fullName: string;
  status: string;
  details: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/records/create-warrant", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WARRANT,
      });

      notify.success(`${lang.record.created_warrant} ${data.fullName}`);
    } else {
      notify.warn(res.data.error);
    }
  } catch (e) {
    Logger.error(CREATE_WARRANT, e);
  }
};

export const createWrittenWarning = (data: {
  name: string;
  officer_name: string;
  infractions: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>): Promise<boolean> => {
  try {
    const res = await handleRequest("/records/create-written-warning", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WRITTEN_WARNING,
      });

      notify.success(`${lang.record.created_warning} ${data.name}`);
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_WRITTEN_WARNING, e);
    return false;
  }
};

export const creatArrestReport = (data: {
  name: string;
  officer_name: string;
  charges: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>): Promise<boolean> => {
  try {
    const res = await handleRequest("/records/create-arrest-report", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_ARREST_REPORT,
      });

      notify.success(`${lang.record.created_arrest_report} ${data.name}`);
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_ARREST_REPORT, e);
    return false;
  }
};

export const createTicket = (data: {
  name: string;
  officer_name: string;
  violations: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>): Promise<boolean> => {
  try {
    const res = await handleRequest("/records/create-ticket", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_TICKET,
      });

      notify.success(`${lang.record.created_ticket} ${data.name}`);
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_TICKET, e);
    return false;
  }
};
