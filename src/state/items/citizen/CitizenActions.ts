import { getErrorFromResponse, handleRequest, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { GetCitizenById, GetUserCitizens } from "./CitizenTypes";

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

// TODO:
export const registerWeapon = (data: RequestData) => async (dispatch: Dispatch<GetCitizenById>) => {
  try {
    const res = await handleRequest(`/citizen/weapons/${data.citizenId}`, "POST", data);

    dispatch({
      type: "GET_CITIZEN_BY_ID",
      citizen: res.data.citizen,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);

    return false;
  }
};
