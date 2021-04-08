import { getErrorFromResponse, handleRequest } from "@lib/utils";
import { Dispatch } from "react";
import { GetUserCitizens } from "./CitizenTypes";

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
