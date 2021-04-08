import { getErrorFromResponse, handleRequest } from "@lib/utils";
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
