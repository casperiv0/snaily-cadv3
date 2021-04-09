import Value from "../../interfaces/Value";
import lang from "../../language.json";
import Logger from "../Logger";
import ValuePaths from "../../interfaces/ValuePaths";
import { handleRequest, isSuccess, notify } from "../functions";
import { Dispatch } from "react";
import {
  DELETE_VALUE,
  ADD_VALUE,
  UPDATE_VALUE_BY_ID,
  VALUES_SET_LOADING,
  GET_VALUES,
} from "../types";

interface IDispatch {
  type: string;
  genders?: Value[];
  ethnicities?: Value[];
  legalStatuses?: Value[];
  weapons?: Value[];
  vehicles?: Value[];
  values?: Value[];
  callTypes?: Value[];
  path?: string;
  error?: string;
  value?: Value;
  loading?: boolean;
}

export const deleteValue = (id: string, path: ValuePaths) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_VALUE,
        values: res.data.values,
        path,
      });

      notify.success(lang.admin.values[path].deleted);
    }
  } catch (e) {
    Logger.error(DELETE_VALUE, e);
  }
};

export const addValue = (path: string, data: { name: string }) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/values/${path}`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: ADD_VALUE,
        values: res.data.values,
        path,
      });

      notify.success(`Successfully added ${data.name} to ${path}`);
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(ADD_VALUE, e);
    return false;
  }
};

export const updateValueById = (path: string, id: string, data: { name: string }) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/values/${path}/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_VALUE_BY_ID,
        values: res.data.values,
        path,
      });

      notify.success("Successfully updated value");

      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_VALUE_BY_ID, e);
    return false;
  }
};

export const getValuesByPath = (path: ValuePaths) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    dispatch({ type: VALUES_SET_LOADING, loading: true });

    const res = await handleRequest(`/values/${path}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_VALUES,
        values: res.data.values,
        path,
      });
    }
  } catch (e) {
    Logger.error(GET_VALUES, e);
  } finally {
    dispatch({ type: VALUES_SET_LOADING, loading: false });
  }
};
