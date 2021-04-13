import { getErrorFromResponse, handleRequest, notify } from "@lib/utils";
import { Dispatch } from "react";
import { Search } from "./OfficerTypes";

export const weaponSearch = (serialNumber: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/weapon", "POST", { serialNumber });

    dispatch({
      type: "WEAPON_SEARCH",
      search: res.data.weapon,
      searchType: "weapon",
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const nameSearch = (name: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/name", "POST", { name });

    dispatch({
      type: "NAME_SEARCH",
      search: res.data,
      searchType: "name",
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const plateSearch = (plate: string) => async (dispatch: Dispatch<Search>) => {
  try {
    const res = await handleRequest("/search/plate", "POST", { plate });

    dispatch({
      type: "PLATE_SEARCH",
      search: res.data.vehicle,
      searchType: "plate",
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};
