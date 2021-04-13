import Bolo from "../../interfaces/Bolo";
import Logger from "../Logger";
import {
  CREATE_BOLO,
  GET_BOLOS,
  DELETE_BOLO,
  UPDATE_BOLOS,
  ModalIds,
  SOCKET_EVENTS,
} from "../types";
import { Dispatch } from "react";
import { handleRequest, isSuccess, modal, notify } from "../functions";
import socket from "../socket";
import lang from "../../language.json";

interface IDispatch {
  type: string;
  error?: string;
  bolos?: Bolo[];
}

export const getActiveBolos = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/dispatch/bolos", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_BOLOS,
        bolos: res.data.bolos,
      });
    }
  } catch (e) {
    Logger.error(GET_BOLOS, e);
  }
};

export const createBolo = (data: object) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/dispatch/bolos", "POST", data);

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_BOLOS);
      dispatch({
        type: CREATE_BOLO,
        bolos: res.data.bolos,
      });

      notify.success(lang.bolos.add_bolo);

      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_BOLO, e);
    return false;
  }
};

export const updateBoloById = (id: string, data: Record<string, unknown>) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/dispatch/bolos/${id}`, "PUT", data);

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_BOLOS);

      dispatch({
        type: UPDATE_BOLOS,
        bolos: res.data.bolos,
      });

      notify.success("Successfully updated bolo");
      modal(ModalIds.EditBolo).hide();
    }
  } catch (e) {
    Logger.error(UPDATE_BOLOS, e);
  }
};

export const deleteBolo = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/dispatch/bolos/${id}`, "DELETE");

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_BOLOS);
      dispatch({
        type: DELETE_BOLO,
        bolos: res.data.bolos,
      });

      notify.success(lang.bolos.removed_bolo);
    }
  } catch (e) {
    Logger.error(DELETE_BOLO, e);
  }
};
