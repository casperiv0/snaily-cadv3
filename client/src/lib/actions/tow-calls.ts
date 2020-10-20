import Logger from "../Logger";
import lang from "../../language.json";
import { Dispatch } from "react";
import { CREATE_TOW_CALL, SET_MESSAGE } from "../types";
import { handleRequest, isSuccess } from "../functions";

interface IDispatch {
  type: string;
  message?: string;
  calls?: object;
}

export const createTowCall = (data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/tow-calls", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_TOW_CALL,
        calls: res.data.calls,
      });
      dispatch({
        type: SET_MESSAGE,
        message: lang.citizen.tow_call_created,
      });
    }
  } catch (e) {
    Logger.error(CREATE_TOW_CALL, e);
  }
};
