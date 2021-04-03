import { Dispatch } from "react";
import Citizen from "../../interfaces/Citizen";
import Logger from "../Logger";
import lang from "../../language.json";
import {
  CREATE_CITIZEN,
  UPDATE_CITIZEN,
  GET_CITIZENS,
  GET_CITIZEN_BY_ID,
  GET_REGISTERED_WEAPONS,
  DELETE_REGISTERED_WEAPON,
  REGISTER_WEAPON,
  GET_REGISTERED_VEHICLES,
  DELETE_REGISTERED_VEHICLE,
  REGISTER_VEHICLE,
  GET_MEDICAL_RECORDS,
  CREATE_MEDICAL_RECORD,
  DELETE_MEDICAL_RECORD,
  DELETE_CITIZEN,
  UPDATE_LICENSES,
  GET_VEHICLE_BY_ID,
  UPDATE_VEHICLE,
  GET_ALL_CITIZENS,
  TRANSFER_VEHICLE,
  REPORT_AS_STOLEN,
} from "../types";
import { handleRequest, isSuccess, notify } from "../functions";
import Weapon from "../../interfaces/Weapon";
import Vehicle from "../../interfaces/Vehicle";
import MedicalRecord from "../../interfaces/MedicalRecord";
import Company from "../../interfaces/Company";

interface IDispatch {
  type: string;
  error?: string;
  citizen?: Citizen;
  citizens?: Citizen[];
  weapons?: Weapon[];
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  medicalRecords?: MedicalRecord[];
  companies?: Company[];
  company?: Company;
}

export const getCitizens = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CITIZENS,
        citizens: res.data.citizens,
      });
    }
  } catch (e) {
    Logger.error(GET_CITIZENS, e);
  }
};

export const getCitizenById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CITIZEN_BY_ID,
        citizen: res.data.citizen,
      });
    }
  } catch (e) {
    Logger.error(GET_CITIZEN_BY_ID, e);
  }
};

export const createCitizen = (data: Partial<Citizen>) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean | string> => {
  try {
    const {
      image,
      full_name,
      gender,
      ethnicity,
      birth,
      hair_color,
      eye_color,
      address,
      height,
      weight,
      dmv,
      pilot_license,
      fire_license,
      ccw,
      phone_nr,
    } = data;

    const fd = new FormData();
    if (image) {
      fd.append("image", image, image?.name);
    }
    fd.append("full_name", full_name!);
    fd.append("gender", gender!);
    fd.append("ethnicity", ethnicity!);
    fd.append("birth", birth!);
    fd.append("hair_color", hair_color!);
    fd.append("eye_color", eye_color!);
    fd.append("address", address!);
    fd.append("height", height!);
    fd.append("weight", weight!);
    fd.append("dmv", dmv!);
    fd.append("pilot_license", pilot_license!);
    fd.append("fire_license", fire_license!);
    fd.append("ccw", ccw!);
    fd.append("phone_nr", phone_nr!);

    const res = await handleRequest("/citizen", "POST", fd);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_CITIZEN,
      });

      return `/citizen/${res.data.citizenId}`;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_CITIZEN, e);
    return false;
  }
};

export const updateCitizen = (id: string, data: Partial<Citizen>) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const {
      image,
      full_name,
      gender,
      ethnicity,
      birth,
      hair_color,
      eye_color,
      address,
      height,
      weight,
      dmv,
      pilot_license,
      fire_license,
      ccw,
      phone_nr,
    } = data;

    const fd = new FormData();
    if (image) {
      fd.append("image", image, image?.name);
    }
    fd.append("full_name", full_name!);
    fd.append("gender", gender!);
    fd.append("ethnicity", ethnicity!);
    fd.append("birth", birth!);
    fd.append("hair_color", hair_color!);
    fd.append("eye_color", eye_color!);
    fd.append("address", address!);
    fd.append("height", height!);
    fd.append("weight", weight!);
    fd.append("dmv", dmv!);
    fd.append("pilot_license", pilot_license!);
    fd.append("fire_license", fire_license!);
    fd.append("ccw", ccw!);
    fd.append("phone_nr", phone_nr!);

    const res = await handleRequest(`/citizen/${id}`, "PUT", fd);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_CITIZEN,
      });

      notify("Successfully updated citizen").success();
      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_CITIZEN, e);
    return false;
  }
};

export const deleteCitizen = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_CITIZEN,
      });
      return (window.location.href = "/citizen");
    }
  } catch (e) {
    Logger.error(DELETE_CITIZEN, e);
  }
};

export const getMedicalRecords = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/medical-records/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MEDICAL_RECORDS,
        medicalRecords: res.data.medicalRecords,
      });
    }
  } catch (e) {
    Logger.error(GET_MEDICAL_RECORDS, e);
  }
};

export const createMedicalRecord = (
  data: object,
  citizenId: string,
  shouldReturn?: boolean,
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/medical-records/${citizenId}`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_MEDICAL_RECORD,
      });

      if (shouldReturn) {
        return (window.location.href = `/citizen/${citizenId}`);
      } else {
        notify("Successfully added medical record").success();
        return true;
      }
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_MEDICAL_RECORD, e);
    return false;
  }
};

export const deleteMedicalRecord = (citizenId: string, recordId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/medical-records/${citizenId}/${recordId}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_MEDICAL_RECORD,
        medicalRecords: res.data.medicalRecords,
      });

      notify("Successfully deleted medical record").success();
    }
  } catch (e) {
    Logger.error(DELETE_MEDICAL_RECORD, e);
  }
};
export const getRegisteredVehicles = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_REGISTERED_VEHICLES,
        vehicles: res.data.vehicles,
      });
    }
  } catch (e) {
    Logger.error(GET_REGISTERED_VEHICLES, e);
  }
};

export const registerVehicle = (data: object) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/citizen/vehicles", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: REGISTER_VEHICLE,
        vehicles: res.data.vehicles,
      });

      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(REGISTER_VEHICLE, e);
    return false;
  }
};

export const reportAsStolen = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/report-stolen/${id}`, "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: REPORT_AS_STOLEN,
      });

      notify(lang.citizen.vehicle.reported_stolen).success();
    }
  } catch (e) {
    Logger.error(REPORT_AS_STOLEN, e);
  }
};

export const deleteVehicle = (citizenId: string, vehicleId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${citizenId}/${vehicleId}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_REGISTERED_VEHICLE,
        vehicles: res.data.vehicles,
      });

      notify(lang.citizen.vehicle.deleted_veh).success();
    }
  } catch (e) {
    Logger.error(DELETE_REGISTERED_VEHICLE, e);
  }
};

export const getRegisteredWeapons = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/weapons/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_REGISTERED_WEAPONS,
        weapons: res.data.weapons,
      });
    }
  } catch (e) {
    Logger.error(GET_REGISTERED_WEAPONS, e);
  }
};

export const registerWeapon = (data: object) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/citizen/weapons", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: REGISTER_WEAPON,
        weapons: res.data.weapons,
      });

      notify("Successfully registered weapon").success();
      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(REGISTER_WEAPON, e);
    return false;
  }
};

export const deleteWeapon = (citizenId: string, weaponId: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/weapons/${citizenId}/${weaponId}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_REGISTERED_WEAPON,
        weapons: res.data.weapons,
      });

      notify(lang.citizen.weapon.deleted_weapon).success();
    }
  } catch (e) {
    Logger.error(DELETE_REGISTERED_WEAPON, e);
  }
};

export const updateLicenses = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/citizen/licenses/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_LICENSES,
      });

      notify("Successfully updated licenses").success();
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_LICENSES, e);
    return false;
  }
};

export const getVehicleById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/i/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_VEHICLE_BY_ID,
        vehicle: res.data.vehicle,
      });
    }
  } catch (e) {
    Logger.error(GET_VEHICLE_BY_ID, e);
  }
};

export const updateVehicleById = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_VEHICLE,
      });

      return true;
    } else {
      notify(res.data.error).warn();
      return false;
    }
  } catch (e) {
    Logger.error(UPDATE_VEHICLE, e);
    return false;
  }
};

export const transferVehicle = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/transfer/${id}`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: TRANSFER_VEHICLE,
      });
      return (window.location.href = "/citizen");
    } else {
      notify(res.data.error).warn();
    }
  } catch (e) {
    Logger.error(TRANSFER_VEHICLE, e);
  }
};

export const getAllCitizens = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen/all", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ALL_CITIZENS,
        citizens: res.data.citizens,
      });
    }
  } catch (e) {
    Logger.error(GET_ALL_CITIZENS, e);
  }
};
