import axios, { AxiosResponse } from "axios";
import SERVER_URL from "../config";

type AllowedMethods = "GET" | "POST" | "DELETE" | "PUT";

export const handleRequest = (path: string, method: AllowedMethods, data?: object) => {
  return axios({
    url: `${SERVER_URL}/api/v1${path}`,
    method,
    data,
    withCredentials: true,
  });
};

export const isSuccess = (res: AxiosResponse) => {
  return res.data.status && res.data.status === "success";
};
