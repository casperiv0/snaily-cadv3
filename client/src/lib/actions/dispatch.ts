import { Dispatch } from "react";
import Call from "../../interfaces/Call";
import Deputy from "../../interfaces/Deputy";
import Officer from "../../interfaces/Officer";
import Logger from "../Logger";
import { handleRequest, isSuccess, notify } from "../functions";
import { ADDRESS_SEARCH, GET_ACTIVE_UNITS } from "../types";

interface IDispatch {
  type: string;
  officers?: Officer[];
  ems_fd?: Deputy[];
  calls?: Call[];
  search?: object;
}

export const getActiveUnits = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/dispatch/active-units", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ACTIVE_UNITS,
        ems_fd: res.data.ems_fd,
        officers: res.data.officers,
      });
    }
  } catch (e) {
    Logger.error("GET_ACTIVE_UNITS", e);
  }
};

export const searchAddress = (address: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/dispatch/search/address", "POST", {
      address,
    });

    if (isSuccess(res)) {
      dispatch({
        type: ADDRESS_SEARCH,
        search: res.data.results,
      });
    }
  } catch (e) {
    Logger.error(ADDRESS_SEARCH, e);
  }
};

export const addCallEvent = (callId: string, text: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/dispatch/event/${callId}`, "POST", { text });

    if (isSuccess(res)) {
      dispatch({
        type: "ADD_CALL_EVENT",
      });

      notify("Successfully added event").success();
    } else {
      notify("An error occurred creating the event").error();
    }
  } catch (e) {
    Logger.error("ADD_CALL_EVENT", e);
  }
};
