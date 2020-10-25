import { Dispatch } from "react";
import User from "../../interfaces/User";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import { AUTHENTICATE, AUTH_ERROR, LOGOUT, SET_LOADING } from "../types";

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

      window.location.href = requestedPath ? `${requestedPath}` : "/citizen";
    } else {
      dispatch({
        type: AUTH_ERROR,
        error: res.data.error,
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
        type: AUTH_ERROR,
        error: res.data.error,
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
      window.location.href = "/login";
    }
  } catch (e) {
    Logger.error(LOGOUT, e);
  }
};
