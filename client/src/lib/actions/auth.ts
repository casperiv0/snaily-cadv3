import Logger from "../Logger";
import User from "../../interfaces/User";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import {
  AUTHENTICATE,
  LOGOUT,
  SET_LOADING,
  DELETE_ACCOUNT,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_ERROR,
  SET_MESSAGE,
} from "../types";
import Message from "../../interfaces/Message";

interface IDispatch {
  type: string;
  loading?: boolean;
  user?: User;
  isAuth?: boolean;
  error?: string | null;
  message?: Message;
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

      window.location.href = requestedPath ? `${requestedPath}` : "/citizen";
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
    }
  } catch (e) {
    Logger.error("LOGIN", e);
  }

  dispatch({ type: SET_LOADING, loading: false });
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

      window.location.href = "/citizen";
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
    }
  } catch (e) {
    Logger.error("REGISTER", e);
  }

  dispatch({ type: SET_LOADING, loading: false });
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
  }
};

export const updatePassword = (data: object) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/auth/update-pw", "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_PASSWORD,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: "Password updated", type: "success" },
      });
    } else {
      dispatch({
        type: UPDATE_PASSWORD_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(UPDATE_PASSWORD, e);
  }
};
