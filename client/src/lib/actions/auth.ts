import Logger from "../Logger";
import User from "../../interfaces/User";
import { Dispatch } from "react";
import { handleRequest, isSuccess, modal, notify } from "../functions";
import {
  AUTHENTICATE,
  LOGOUT,
  SET_LOADING,
  DELETE_ACCOUNT,
  UPDATE_PASSWORD,
  UNLINK_STEAM,
  ModalIds,
} from "../types";

interface IDispatch {
  type: string;
  loading?: boolean;
  user?: User;
  isAuth?: boolean;
  error?: string | null;
}

export const login = (data: object, requestedPath: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/login", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        isAuth: true,
        error: null,
        user: res.data.user,
      });

      return (window.location.href = requestedPath ?? "/citizen");
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    notify.error(e);
    Logger.error("LOGIN", e);
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
  return false;
};

export const register = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/register", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        isAuth: true,
        error: null,
        user: res.data.user,
      });

      return (window.location.href = "/citizen");
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error("REGISTER", e);
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }

  return false;
};

export const checkAuth = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/auth/user", "POST");

    if (isSuccess(res)) {
      dispatch({
        type: AUTHENTICATE,
        user: res.data.user,
        isAuth: true,
        error: null,
      });
    }
  } catch (e) {
    Logger.error("CHECK_AUTH", e);
  }

  dispatch({ type: SET_LOADING, loading: false });
};

export const logout = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/auth/logout", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: LOGOUT,
      });
      return (window.location.href = "/login");
    }
  } catch (e) {
    Logger.error(LOGOUT, e);
    notify.error(e);
  }
};

export const deleteAccount = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/auth/delete-account", "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_ACCOUNT,
      });
      return (window.location.href = "/login");
    }
  } catch (e) {
    Logger.error(DELETE_ACCOUNT, e);
    notify.error(e);
  }
};

export const updatePassword = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/auth/update-pw", "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_PASSWORD,
      });

      modal(ModalIds.EditPassword).hide();
      notify.success("Successfully updated password");
    } else {
      notify.warn(res.data.error);
    }
  } catch (e) {
    Logger.error(UPDATE_PASSWORD, e);
    notify.error(e);
  }
};

export const unlinkSteam = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/auth/steam", "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: UNLINK_STEAM,
      });

      notify.success("Successfully unlinked Steam");
    } else {
      notify.warn(res.data.error);
    }
  } catch (e) {
    Logger.error(UNLINK_STEAM, e);
    notify.error(e);
  }
};
