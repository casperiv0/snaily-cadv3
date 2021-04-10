import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { GetCitizenById, GetUserCitizens, RegisterVehicle, RegisterWeapon } from "./CitizenTypes";
import lang from "src/language.json";

export const getUserCitizens = (cookie?: string) => async (dispatch: Dispatch<GetUserCitizens>) => {
  try {
    const res = await handleRequest("/citizen/", "GET", {
      cookie,
    });

    dispatch({
      type: "GET_USER_CITIZENS",
      citizens: res.data.citizens,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getCitizenById = (id: string, cookie?: string) => async (
  dispatch: Dispatch<GetCitizenById>,
) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_BY_ID",
      citizen: res.data.citizen,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const registerVehicle = (data: RequestData) => async (
  dispatch: Dispatch<RegisterVehicle>,
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${data.citizenId}`, "POST", data);

    dispatch({
      type: "REGISTER_VEHICLE",
      vehicles: res.data.vehicles,
    });

    return notify.success(lang.citizen.vehicle.added_veh);
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const registerWeapon = (data: RequestData) => async (dispatch: Dispatch<RegisterWeapon>) => {
  try {
    const res = await handleRequest(`/citizen/weapons/${data.citizenId}`, "POST", data);

    dispatch({
      type: "REGISTER_WEAPON",
      weapons: res.data.weapons,
    });

    return notify.success("Successfully registered weapon");
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};
