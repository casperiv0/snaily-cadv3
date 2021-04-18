import { getErrorFromResponse, handleRequest, modal, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { IBolos } from "./BoloTypes";
import lang from "src/language.json";
import { socket } from "@hooks/useSocket";
import { SocketEvents } from "types/Socket";
import { ModalIds } from "types/ModalIds";

export const getBolos = (headers?: any) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest(
      "/bolos",
      "GET",
      headers && {
        cookie: headers?.cookie,
        url: headers?.host,
      },
    );

    dispatch({
      type: "GET_BOLOS",
      bolos: res.data.bolos,
    });
  } catch (e) {
    return false;
  }
};

export const deleteBolo = (id: string) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest(`/bolos/${id}`, "DELETE");

    dispatch({
      type: "DELETE_BOLO",
      bolos: res.data.bolos,
    });

    socket.emit(SocketEvents.UpdateBolos);
    return notify.success(lang.bolos.removed_bolo);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const createBolo = (data: RequestData) => async (dispatch: Dispatch<IBolos>) => {
  try {
    const res = await handleRequest("/bolos", "POST", data);

    dispatch({
      type: "CREATE_BOLO",
      bolos: res.data.bolos,
    });
    socket.emit(SocketEvents.UpdateBolos);

    return notify.success(lang.bolos.add_bolo);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};

export const updateBoloById = (id: string, data: RequestData) => async (
  dispatch: Dispatch<IBolos>,
) => {
  try {
    const res = await handleRequest(`/bolos/${id}`, "PUT", data);

    dispatch({
      type: "UPDATE_BOLOS",
      bolos: res.data.bolos,
    });
    socket.emit(SocketEvents.UpdateBolos);
    modal(ModalIds.EditBolo)?.hide();

    return notify.success(lang.bolos.updated_bolo);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
