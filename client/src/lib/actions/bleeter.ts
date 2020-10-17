import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import { GET_BLEETS, GET_BLEET_BY_ID, SET_LOADING_BLEETS } from "../types";
import Bleet from "../../interfaces/Bleet";
import Logger from "../Logger";

interface IDispatch {
  type: string;
  loading?: boolean;
  bleets?: Bleet[];
  bleet?: Bleet;
}

export const getBleetPosts = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING_BLEETS, loading: true });

  try {
    const res = await handleRequest("/bleeter", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_BLEETS,
        bleets: res.data.bleets,
      });
    }
  } catch (e) {
    Logger.error(GET_BLEETS, e);
  }

  dispatch({ type: SET_LOADING_BLEETS, loading: false });
};

export const getBleetById = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  dispatch({ type: SET_LOADING_BLEETS, loading: true });

  try {
    const res = await handleRequest(`/bleeter/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_BLEET_BY_ID,
        bleet: res.data.bleet,
      });
    }
  } catch (e) {
    Logger.error(GET_BLEET_BY_ID, e);
  }

  dispatch({ type: SET_LOADING_BLEETS, loading: false });
};
