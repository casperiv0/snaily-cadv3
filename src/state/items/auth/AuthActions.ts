import { getErrorFromResponse, handleRequest, modal, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import {} from "redux";
import { ModalIds } from "types/ModalIds";
import { Authenticate, UnlinkSteam, UpdatePassword, VerifyAuth } from "./AuthTypes";

export const login = (data: { username: string; password: string }) => async (
  dispatch: Dispatch<Authenticate>,
) => {
  try {
    const res = await handleRequest("/auth/login", "POST", data);

    dispatch({
      type: "AUTHENTICATE",
      user: res.data.user,
      isAuth: !!res.data.user,
    });
    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    notify.warn(error);
    return false;
  }
};

export const register = (data: { username: string; password: string; password2: string }) => async (
  dispatch: Dispatch<Authenticate>,
) => {
  try {
    const res = await handleRequest("/auth/register", "POST", data);

    dispatch({
      type: "AUTHENTICATE",
      user: res.data.user,
      isAuth: !!res.data.user,
    });
    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    notify.warn(error);
    return false;
  }
};

export const verifyAuth = (cookie?: string) => async (dispatch: Dispatch<VerifyAuth>) => {
  try {
    const res = await handleRequest("/auth/user", "POST", {
      cookie,
    });

    dispatch({
      type: "VERIFY_AUTH",
      user: res.data.user,
      isAuth: !!res.data.user,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const deleteAccount = () => async (dispatch: Dispatch<Authenticate>) => {
  try {
    await handleRequest("/auth/user", "DELETE");

    dispatch({
      type: "AUTHENTICATE",
      user: null,
      isAuth: false,
    });

    modal(ModalIds.DeleteAccount)?.hide();
    return (window.location.href = "/auth/login");
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.error(error);
  }
};

export const updatePassword = (data: RequestData) => async (dispatch: Dispatch<UpdatePassword>) => {
  try {
    await handleRequest("/auth/user", "PUT", data);

    dispatch({
      type: "UPDATE_PASSWORD",
    });

    modal(ModalIds.EditPassword)?.hide();
    notify.success("Successfully updated password!");
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.warn(error);
  }
};

export const logout = () => async (dispatch: Dispatch<Authenticate>) => {
  try {
    await handleRequest("/auth/logout", "POST");

    dispatch({
      type: "AUTHENTICATE",
      user: null,
      isAuth: false,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.error(error);
  }
};

export const unLinkSteam = () => async (dispatch: Dispatch<UnlinkSteam>) => {
  try {
    await handleRequest("/auth/steam/unlink", "DELETE");

    dispatch({
      type: "UNLINK_STEAM",
    });

    notify.success("Successfully unlinked steam");
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.error(error);
  }
};
