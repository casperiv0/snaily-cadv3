import Bolo from "../../interfaces/Bolo";
import Logger from "../Logger";
import { CREATE_BOLO, GET_BOLOS, DELETE_BOLO } from "../types";
import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import socket from "../socket";
import lang from "../../language.json";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  error?: string;
  bolos?: Bolo[];
  message?: Message;
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
      socket.emit("UPDATE_BOLOS");
      dispatch({
        type: CREATE_BOLO,
        bolos: res.data.bolos,
      });

      notify(lang.bolos.add_bolo).success();

      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_BOLO, e);
    return false;
  }
};

export const deleteBolo = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/dispatch/bolos/${id}`, "DELETE");

    if (isSuccess(res)) {
      socket.emit("UPDATE_BOLOS");
      dispatch({
        type: DELETE_BOLO,
        bolos: res.data.bolos,
      });

      notify(lang.bolos.removed_bolo).success();
    }
  } catch (e) {
    Logger.error(DELETE_BOLO, e);
  }
};
