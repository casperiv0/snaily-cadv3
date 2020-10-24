import { Dispatch } from "react";
import Value from "../../interfaces/Value";
import Vehicle from "../../interfaces/Vehicle";
import Weapon from "../../interfaces/Weapon";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import {
  GET_ETHNICITIES,
  GET_GENDERS,
  GET_LEGAL_STATUSES,
  GET_WEAPONS,
} from "../types";

interface IDispatch {
  type: string;
  genders?: Value[];
  ethnicities?: Value[];
  legalStatuses?: Value[];
  weapons?: Weapon[];
  vehicles?: Vehicle[];
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

/* Legal Statuses */
export const getLegalStatuses = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/values/legal-statuses", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_LEGAL_STATUSES,
        legalStatuses: res.data.legalStatuses,
      });
    }
  } catch (e) {
    Logger.error(GET_LEGAL_STATUSES, e);
  }
};

/* weapons */
export const getWeapons = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/values/weapons", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_WEAPONS,
        weapons: res.data.weapons,
      });
    }
  } catch (e) {
    Logger.error(GET_LEGAL_STATUSES, e);
  }
};
