import { Dispatch } from "react";
import { handleRequest } from "../functions";
import Bleet from "../../interfaces/Bleet";
import { GET_BLEETS, SET_LOADING } from "../types";
import Logger from "../Logger";

interface IDispatch {
  type?: string;
  loading?: boolean;
  bleets?: Bleet[];
}

export const getBleets = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_LOADING, loading: true });

  try {
    const res = await handleRequest("/bleeter", "GET");

    dispatch({ type: GET_BLEETS, bleets: res.data.bleets });
  } catch (e) {
    Logger.error("BLEETER", e);
  }
};
