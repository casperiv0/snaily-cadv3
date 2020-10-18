import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import { CREATE_WARRANT } from "../types";

interface IDispatch {
  type: string;
}

export const createWarrant = (data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/records/create-warrant", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_WARRANT,
      });
    } else {
      Logger.log("CREATE_WARRANT_ERROR", res.data.error);
    }
  } catch (e) {
    Logger.error(CREATE_WARRANT, e);
  }
};
