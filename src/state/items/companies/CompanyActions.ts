import { getErrorFromResponse, handleRequest } from "@lib/utils";
import { Dispatch } from "react";
import { GetCompanies } from "./CompanyTypes";

export const getCompanies = (cookie?: string) => async (dispatch: Dispatch<GetCompanies>) => {
  try {
    const res = await handleRequest("/companies", "GET", { cookie });

    dispatch({
      type: "GET_COMPANIES",
      companies: res.data.companies,
    });

    return true;
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};
