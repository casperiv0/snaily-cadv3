import lang from "../../language.json";
import Logger from "../Logger";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import {
  CREATE_WARRANT,
  SET_MESSAGE,
  CREATE_WRITTEN_WARNING,
  CREATE_WRITTEN_WARNING_ERROR,
  CREATE_ARREST_REPORT_ERROR,
  CREATE_ARREST_REPORT,
  CREATE_TICKET,
  CREATE_TICKET_ERROR,
} from "../types";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  error?: string;
  message?: Message;
}

export function resetError(type: string, dispatch: Dispatch<IDispatch>) {
  setTimeout(() => {
    dispatch({
      type: type,
      error: "",
    });
  }, 200);
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.record.created_warrant} ${data.fullName}`, type: "success" },
      });
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
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
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/records/create-written-warning", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WRITTEN_WARNING,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.record.created_warning} ${data.name}`, type: "success" },
      });
      resetError(CREATE_WRITTEN_WARNING_ERROR, dispatch);
    } else {
      dispatch({
        type: CREATE_WRITTEN_WARNING_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_WRITTEN_WARNING, e);
  }
};

export const creatArrestReport = (data: {
  name: string;
  officer_name: string;
  charges: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/records/create-arrest-report", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_ARREST_REPORT,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.record.created_arrest_report} ${data.name}`, type: "success" },
      });
      resetError(CREATE_ARREST_REPORT_ERROR, dispatch);
    } else {
      dispatch({
        type: CREATE_ARREST_REPORT_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_ARREST_REPORT, e);
  }
};

export const createTicket = (data: {
  name: string;
  officer_name: string;
  violations: string;
  postal: string;
  notes: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/records/create-ticket", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_TICKET,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.record.created_ticket} ${data.name}`, type: "success" },
      });
      resetError(CREATE_TICKET_ERROR, dispatch);
    } else {
      dispatch({
        type: CREATE_TICKET_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_TICKET, e);
  }
};
