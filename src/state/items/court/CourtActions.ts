import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import { Dispatch } from "react";
import { RequestExpungement, SearchCitizen, GetExpungementRequests } from "./CourtTypes";
import lang from "src/language.json";

export const requestExpungement = (citizenId: string, data: RequestData) => async (
  dispatch: Dispatch<RequestExpungement>,
) => {
  try {
    await handleRequest(`/citizen/expungement-request/${citizenId}`, "POST", data);

    dispatch({
      type: "REQUEST_EXPUNGEMENT",
    });

    return notify.success(lang.court.request_success);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const searchCitizen = (name: string) => async (dispatch: Dispatch<SearchCitizen>) => {
  try {
    const res = await handleRequest("/citizen/expungement-request", "POST", { name });

    dispatch({
      type: "SEARCH_CITIZEN",
      courtResult: {
        citizenId: res.data.citizenId,
        tickets: res.data.tickets,
        warrants: res.data.warrants,
        arrestReports: res.data.arrestReports,
      },
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const getExpungementRequests = (headers?: any) => async (
  dispatch: Dispatch<GetExpungementRequests>,
) => {
  try {
    const res = await handleRequest("/citizen/expungement-request", "GET", headers);

    dispatch({
      type: "GET_EXPUNGEMENT_REQUESTS",
      expungementRequests: res.data.requests,
    });
  } catch (e) {
    return false;
  }
};
