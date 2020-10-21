import { Dispatch } from "react";
import Value from "../../interfaces/Value";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import { GET_ETHNICITIES, GET_GENDERS } from "../types";

interface IDispatch {
  type: string;
  genders?: Value[];
  ethnicities?: Value[];
}

/* genders */
export const getGenders = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/values/genders", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_GENDERS,
        genders: res.data.genders,
      });
    }
  } catch (e) {
    Logger.error(GET_GENDERS, e);
  }
};

/* ethnicities */
export const getEthnicities = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/values/ethnicities", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ETHNICITIES,
        ethnicities: res.data.ethnicities,
      });
    }
  } catch (e) {
    Logger.error(GET_ETHNICITIES, e);
  }
};
