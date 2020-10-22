import Citizen from "../../interfaces/Citizen";
import Logger from "../Logger";
import {
  CREATE_CITIZEN,
  CREATE_CITIZEN_ERROR,
  GET_CITIZENS,
  GET_CITIZEN_BY_ID,
} from "../types";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";

interface IDispatch {
  type: string;
  error?: string;
  citizen?: Citizen;
  citizens?: Citizen[];
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

export const getCitizenById = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
  } catch (e) {
    Logger.error(GET_CITIZEN_BY_ID, e);
  }
};

export const createCitizen = (data: Citizen) => async (
  dispatch: Dispatch<IDispatch>
) => {
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
    } = data;

    const fd = new FormData();
    fd.append("image", image, image?.name);
    fd.append("full_name", full_name);
    fd.append("gender", gender);
    fd.append("ethnicity", ethnicity);
    fd.append("birth", birth);
    fd.append("hair_color", hair_color);
    fd.append("eye_color", eye_color);
    fd.append("address", address);
    fd.append("height", height);
    fd.append("weight", weight);
    fd.append("dmv", dmv);
    fd.append("pilot_license", pilot_license);
    fd.append("fire_license", fire_license);
    fd.append("ccw", ccw);

    const res = await handleRequest("/citizen", "POST", fd);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_CITIZEN,
      });
      return (window.location.href = "/citizen");
    } else {
      dispatch({
        type: CREATE_CITIZEN_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_CITIZEN, e);
  }
};
