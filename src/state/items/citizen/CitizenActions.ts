import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "lib/utils";
import {
  GetCitizenById,
  ICitizenWeapons,
  GetUserCitizens,
  RegisterWeapon,
  ICitizenVehicles,
  UpdateCitizenLicenses,
  CreateCitizen,
  DeleteCitizenById,
  IMedicalRecords,
  GetUserCompanies,
} from "./CitizenTypes";
import lang from "src/language.json";
import { Citizen } from "types/Citizen";
import { MedicalRecord } from "types/MedicalRecord";

export const getUserCitizens = (headers?: any) => async (dispatch: Dispatch<GetUserCitizens>) => {
  try {
    const res = await handleRequest("/citizen/", "GET", headers);

    dispatch({
      type: "GET_USER_CITIZENS",
      citizens: res.data.citizens,
    });
  } catch (e) {
    return false;
  }
};

export const getCitizenById =
  (id: string, headers?: any) => async (dispatch: Dispatch<GetCitizenById>) => {
    try {
      const res = await handleRequest(`/citizen/${id}`, "GET", headers);

      dispatch({
        type: "GET_CITIZEN_BY_ID",
        citizen: res.data.citizen,
      });
    } catch (e) {
      return false;
    }
  };

export const getCitizenWeapons =
  (citizenId: string, headers?: any) => async (dispatch: Dispatch<ICitizenWeapons>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/weapons`, "GET", headers);

      dispatch({
        type: "GET_CITIZEN_WEAPONS",
        weapons: res.data.weapons,
      });
    } catch (e) {
      return false;
    }
  };

export const deleteWeaponById =
  (citizenId: string, id: string) => async (dispatch: Dispatch<ICitizenWeapons>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/weapons?weaponId=${id}`, "DELETE");

      dispatch({
        type: "DELETE_WEAPON_BY_ID",
        weapons: res.data.weapons,
      });
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.error(error);
    }
  };

export const getCitizenVehicles =
  (citizenId: string, headers?: any) => async (dispatch: Dispatch<ICitizenVehicles>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/vehicles`, "GET", headers);

      dispatch({
        type: "GET_CITIZEN_VEHICLES",
        vehicles: res.data.vehicles,
      });
    } catch (e) {
      return false;
    }
  };

export const deleteVehicleById =
  (citizenId: string, id: string) => async (dispatch: Dispatch<ICitizenVehicles>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/vehicles?vehicleId=${id}`, "DELETE");

      dispatch({
        type: "DELETE_VEHICLE_BY_ID",
        vehicles: res.data.vehicles,
      });

      return true;
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.error(error);
    }
  };

export const updateVehicleById =
  (citizenId: string, vehicleId: string, data: RequestData) =>
  async (dispatch: Dispatch<ICitizenVehicles>) => {
    try {
      const res = await handleRequest(
        `/citizen/${citizenId}/vehicles?vehicleId=${vehicleId}`,
        "PUT",
        data,
      );

      dispatch({
        type: "UPDATE_VEHICLE_BY_ID",
        vehicles: res.data.vehicles,
      });

      return notify.success(lang.citizen.vehicle.updated_veh);
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.warn(error);
    }
  };

export const registerVehicle =
  (data: RequestData) => async (dispatch: Dispatch<ICitizenVehicles>) => {
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

    return notify.success(lang.citizen.weapon.added_weapon);
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const updateLicenses =
  (citizenId: string, data: RequestData) => async (dispatch: Dispatch<UpdateCitizenLicenses>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/licenses`, "PUT", data);

      dispatch({
        type: "UPDATE_CITIZEN_LICENSES",
        citizen: res.data.citizen,
      });

      return notify.success(lang.citizen.updated_licenses);
    } catch (e) {
      const error = getErrorFromResponse(e);

      return notify.warn(error);
    }
  };

export const createCitizen =
  (data: Partial<Citizen>) => async (dispatch: Dispatch<CreateCitizen>) => {
    try {
      const fd = new FormData();

      if (data.image) {
        fd.append("image", data.image, data.image?.name);
      }

      fd.append("full_name", data.full_name as string);
      fd.append("gender", data.gender as string);
      fd.append("ethnicity", data.ethnicity as string);
      fd.append("birth", data.birth as string);
      fd.append("hair_color", data.hair_color as string);
      fd.append("eye_color", data.eye_color as string);
      fd.append("address", data.address as string);
      fd.append("height", data.height as string);
      fd.append("weight", data.weight as string);
      fd.append("dmv", data.dmv as string);
      fd.append("pilot_license", data.pilot_license as string);
      fd.append("fire_license", data.fire_license as string);
      fd.append("ccw", data.ccw as string);
      fd.append("phone_nr", data.phone_nr as string);
      fd.append("create_officer", `${data.create_officer}`);
      fd.append("department", `${data.department}`);
      fd.append("callsign", `${data.callsign}`);
      fd.append("cdl_license", `${data.cdl_license}`);

      const res = await handleRequest("/citizen", "POST", fd as unknown as RequestData);

      dispatch({
        type: "CREATE_CITIZEN",
      });

      return `/citizen/${res.data.citizenId}`;
    } catch (e) {
      const error = getErrorFromResponse(e);

      return notify.warn(error);
    }
  };

export const updateCitizen =
  (id: string, data: Partial<Citizen>) =>
  async (dispatch: Dispatch<{ type: "UPDATE_CITIZEN_BY_ID" }>) => {
    try {
      const fd = new FormData();

      if (typeof data.image !== "string" && data.image) {
        fd.append("image", data.image, data.image?.name);
      } else {
        fd.append("image", data.image);
      }

      fd.append("full_name", data.full_name as string);
      fd.append("gender", data.gender as string);
      fd.append("ethnicity", data.ethnicity as string);
      fd.append("birth", data.birth as string);
      fd.append("hair_color", data.hair_color as string);
      fd.append("eye_color", data.eye_color as string);
      fd.append("address", data.address as string);
      fd.append("height", data.height as string);
      fd.append("weight", data.weight as string);
      fd.append("dmv", data.dmv as string);
      fd.append("pilot_license", data.pilot_license as string);
      fd.append("fire_license", data.fire_license as string);
      fd.append("ccw", data.ccw as string);
      fd.append("phone_nr", data.phone_nr as string);

      await handleRequest(`/citizen/${id}`, "PUT", fd as unknown as RequestData);

      dispatch({
        type: "UPDATE_CITIZEN_BY_ID",
      });

      return notify.success(`${lang.citizen.update_success} ${data.full_name}`);
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.warn(error);
    }
  };

export const deleteCitizenById = (id: string) => async (dispatch: Dispatch<DeleteCitizenById>) => {
  try {
    await handleRequest(`/citizen/${id}`, "DELETE");

    dispatch({
      type: "DELETE_CITIZEN_BY_ID",
    });

    return notify.success(lang.citizen.deleted_citizen);
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const getMedicalRecords =
  (citizenId: string, headers?: any) => async (dispatch: Dispatch<IMedicalRecords>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/medical-records`, "GET", headers);

      dispatch({
        type: "GET_MEDICAL_RECORDS",
        medicalRecords: res.data.medicalRecords,
      });
    } catch (e) {
      return false;
    }
  };

export const createMedicalRecord =
  (citizenId: string, data: Partial<MedicalRecord>) =>
  async (dispatch: Dispatch<IMedicalRecords>) => {
    try {
      const res = await handleRequest(`/citizen/${citizenId}/medical-records`, "POST", data);

      dispatch({
        type: "CREATE_MEDICAL_RECORD",
        medicalRecords: res.data.medicalRecords,
      });

      return notify.success(lang.citizen.medical.add_med);
    } catch (e) {
      const error = getErrorFromResponse(e);

      return notify.warn(error);
    }
  };

export const deleteMedicalRecord =
  (citizenId: string, recordId: string) => async (dispatch: Dispatch<IMedicalRecords>) => {
    try {
      const res = await handleRequest(
        `/citizen/${citizenId}/medical-records?recordId=${recordId}`,
        "DELETE",
      );

      dispatch({
        type: "DELETE_MEDICAL_RECORDS",
        medicalRecords: res.data.medicalRecords,
      });

      return notify.success(lang.citizen.deleted_medical_record);
    } catch (e) {
      const error = getErrorFromResponse(e);

      return notify.warn(error);
    }
  };

export const getUserCompanies = (headers?: any) => async (dispatch: Dispatch<GetUserCompanies>) => {
  try {
    const res = await handleRequest("/citizen/companies", "GET", headers);

    dispatch({
      type: "GET_USER_COMPANIES",
      companies: res.data.companies,
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const transferVehicle =
  (id: string, data: RequestData) => async (dispatch: Dispatch<ICitizenVehicles>) => {
    try {
      const res = await handleRequest(`/citizen/transfer-vehicle/${id}`, "PUT", data);

      dispatch({
        type: "TRANSFER_VEHICLE",
        vehicles: res.data.vehicles,
      });

      return notify.success(lang.citizen.transfer_vehicle_success);
    } catch (e) {
      const error = getErrorFromResponse(e);
      return notify.warn(error);
    }
  };
