import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Value } from "types/Value";
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

export const addValue = (path: string, data: Partial<Value>) => async (
  dispatch: Dispatch<IValues>,
) => {
  try {
    const res = await handleRequest(`/values/${path}`, "POST", data);

    dispatch({
      type: "ADD_VALUE",
      values: res.data.values,
      path: path as ValuePaths,
    });

    return notify.success(`Successfully added ${data.name} to ${path}`);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const updateValueById = (path: string, id: string, data: Partial<Value>) => async (
  dispatch: Dispatch<IValues>,
) => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "PUT", data);

    dispatch({
      type: "UPDATE_VALUE_BY_ID",
      values: res.data.values,
      path: path as ValuePaths,
    });

    return notify.success("Successfully updated value");
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
