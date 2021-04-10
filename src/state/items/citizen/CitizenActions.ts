import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import {
  GetCitizenById,
  ICitizenWeapons,
  GetUserCitizens,
  RegisterVehicle,
  RegisterWeapon,
  ICitizenVehicles,
  UpdateCitizenLicenses,
} from "./CitizenTypes";
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

export const getCitizenWeapons = (citizenId: string, cookie?: string) => async (
  dispatch: Dispatch<ICitizenWeapons>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/weapons`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_WEAPONS",
      weapons: res.data.weapons,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const deleteWeaponById = (citizenId: string, id: string) => async (
  dispatch: Dispatch<ICitizenWeapons>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}?weaponId=${id}`, "DELETE");

    dispatch({
      type: "DELETE_WEAPON_BY_ID",
      weapons: res.data.weapons,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getCitizenVehicles = (citizenId: string, cookie?: string) => async (
  dispatch: Dispatch<ICitizenVehicles>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/vehicles`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_VEHICLES",
      vehicles: res.data.vehicles,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const deleteVehicleById = (citizenId: string, id: string) => async (
  dispatch: Dispatch<ICitizenVehicles>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/vehicles?vehicleId=${id}`, "DELETE");

    dispatch({
      type: "DELETE_VEHICLE_BY_ID",
      vehicles: res.data.vehicles,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.error(error);
  }
};

export const registerVehicle = (data: RequestData) => async (
  dispatch: Dispatch<RegisterVehicle>,
) => {
  try {
    const res = await handleRequest(`/citizen/${data.citizenId}/vehicles`, "POST", data);

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
    const res = await handleRequest(`/citizen/${data.citizenId}/weapons`, "POST", data);

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

export const updateLicenses = (citizenId: string, data: RequestData) => async (
  dispatch: Dispatch<UpdateCitizenLicenses>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/licenses`, "PUT", data);

    dispatch({
      type: "UPDATE_CITIZEN_LICENSES",
      citizen: res.data.citizen,
    });

    return notify.success("Successfully registered weapon");
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};
