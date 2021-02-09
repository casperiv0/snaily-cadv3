import axios, { AxiosResponse } from "axios";
type AllowedMethods = "GET" | "POST" | "DELETE" | "PUT";
let url: string | undefined = "/";

if (process.env.REACT_APP_IS_DEV) {
  url = process.env.REACT_APP_SERVER_URL;
}

export const handleRequest = (path: string, method: AllowedMethods, data?: object) => {
  return axios({
    url: `${url}api/v1${path}`,
    method,
    data,
    withCredentials: true,
  });
};

export const isSuccess = (res: AxiosResponse) => {
  const isNotLogin = !["/login", "/logout", "/register", "/"].includes(window.location.pathname);
  if (isNotLogin && res.data?.invalid_token) {
    console.clear();
    window.location.href = "/login";

    return false;
  }

  return res.data.status && res.data.status === "success";
};

export const playSound = (dir: string): void => {
  new Audio(dir).play();
};
