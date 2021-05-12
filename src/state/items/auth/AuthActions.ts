import { getErrorFromResponse, handleRequest, modal, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { ModalIds } from "types/ModalIds";
import { Authenticate, UnlinkSteam, UpdatePassword, UpdateUsername, VerifyAuth } from "./AuthTypes";
import lang from "src/language.json";

export const login =
  (data: { username: string; password: string }) => async (dispatch: Dispatch<Authenticate>) => {
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

      notify.warn(error);
      return false;
    }
  };

export const register = (data: RequestData) => async (dispatch: Dispatch<Authenticate>) => {
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

    notify.warn(error);
    return false;
  }
};

export const verifyAuth = (headers?: any) => async (dispatch: Dispatch<VerifyAuth>) => {
  try {
    const res = await handleRequest("/auth/user", "POST", headers);

    dispatch({
      type: "VERIFY_AUTH",
      user: res.data.user,
      isAuth: !!res.data.user,
    });
  } catch (e) {
    return false;
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
    await handleRequest("/auth/user/password", "PUT", data);

    dispatch({
      type: "UPDATE_PASSWORD",
    });

    modal(ModalIds.EditPassword)?.hide();
    notify.success(lang.auth.updated_password);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const updateUsername = (data: RequestData) => async (dispatch: Dispatch<UpdateUsername>) => {
  try {
    const res = await handleRequest("/auth/user/username", "PUT", data);

    dispatch({
      type: "UPDATE_USERNAME",
      user: res.data.user,
    });

    modal(ModalIds.EditUsername)?.hide();
    notify.success(lang.auth.updated_username);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
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
    return notify.error(error);
  }
};

export const unLinkSteam = () => async (dispatch: Dispatch<UnlinkSteam>) => {
  try {
    await handleRequest("/auth/steam/unlink", "DELETE");

    dispatch({
      type: "UNLINK_STEAM",
    });

    return notify.success(lang.auth.unlinked_steam);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.error(error);
  }
};
