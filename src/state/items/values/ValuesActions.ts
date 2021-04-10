import { getErrorFromResponse, handleRequest } from "@lib/utils";
import { Dispatch } from "react";
import { ValuePaths } from "types/ValuePaths";
import { IValues } from "./ValuesTypes";

export const getValuesByPath = (path: ValuePaths, cookie?: string) => async (
  dispatch: Dispatch<IValues>,
) => {
  try {
    const res = await handleRequest(`/values/${path}`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_VALUES",
      values: res.data.values,
      path,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
