import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Value } from "types/Value";
import { ValuePaths } from "types/ValuePaths";
import { IValues } from "./ValuesTypes";
import lang from "src/language.json";

export const getValuesByPath =
  (path: ValuePaths, headers?: any) => async (dispatch: Dispatch<IValues>) => {
    try {
      const res = await handleRequest(`/values/${path}`, "GET", headers);

      dispatch({
        type: "GET_VALUES",
        values: res.data.values,
        path,
      });
    } catch (e) {
      return false;
    }
  };

export const addValue =
  (path: string, data: Partial<Value>) => async (dispatch: Dispatch<IValues>) => {
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

export const updateValueById =
  (path: string, id: string, data: Partial<Value>) => async (dispatch: Dispatch<IValues>) => {
    try {
      const res = await handleRequest(`/values/${path}/${id}`, "PUT", data);

      dispatch({
        type: "UPDATE_VALUE_BY_ID",
        values: res.data.values,
        path: path as ValuePaths,
      });

      return notify.success(lang.admin.values[path].updated);
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.warn(error);
    }
  };

export const deleteValueById =
  (path: string, id: string) => async (dispatch: Dispatch<IValues>) => {
    try {
      const res = await handleRequest(`/values/${path}/${id}`, "DELETE");

      dispatch({
        type: "DELETE_VALUE_BY_ID",
        values: res.data.values,
        path: path as ValuePaths,
      });

      return notify.success(lang.admin.values[path].deleted);
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.warn(error);
    }
  };
