import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import { CREATE_WARRANT, CREATE_WARRANT_ERROR, SET_MESSAGE } from "../types";
import lang from "../../language.json";
import Logger from "../Logger";

interface IDispatch {
  type: string;
  error?: string;
  message?: string;
}

export const createWarrant = (data: {
  fullName: string;
  status: string;
  details: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/records/create-warrant", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WARRANT,
      });
      dispatch({
        type: SET_MESSAGE,
        message: `${lang.record.created_warrant} ${data.fullName}`,
      });
    } else {
      dispatch({
        type: CREATE_WARRANT_ERROR,
        error: res.data.error,
      });
      Logger.log("CREATE_WARRANT_ERROR", res.data.error);
    }
  } catch (e) {
    Logger.error(CREATE_WARRANT, e);
  }
};
