import axios, { AxiosResponse } from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

export const playSound = (dir: string): void => {
  new Audio(dir).play();
};
