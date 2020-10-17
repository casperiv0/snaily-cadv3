import { Dispatch } from "redux";
import Call from "../../interfaces/Call";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import { GET_911_CALLS } from "../types";

interface IDispatch {
  type: string;
  calls?: Call[];
}

export const getActive911Calls = () => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/global/911-calls", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_911_CALLS,
        calls: res.data.calls,
      });
    }
  } catch (e) {
    Logger.error("GET_ACTIVE_911_CALLS", e);
  }
};
