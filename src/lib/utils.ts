import axios from "axios";
import { toast, ToastOptions } from "react-toastify";
import { ModalIds } from "types/ModalIds";

export type RequestData = Record<string, unknown>;
export type AllowedMethods = "PATCH" | "PUT" | "DELETE" | "OPTIONS" | "GET" | "POST";

export function handleRequest(
  path: string,
  method: AllowedMethods = "GET",
  data:
    | RequestData
    | {
        cookie: string;
        url: string;
      } = {},
) {
  const url = data?.url ? `http://${data?.url}/` : "/";

  return axios({
    url: `${url}api${path}`,
    method,
    data: data ? data : null,
    withCredentials: true,
    headers: {
      Session: (data?.cookie as string)?.split("snaily-cad-session=")?.[1] ?? "",
      "Content-Type": "application/json",
    },
  });
}

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      style: {
        background: "#D1E7DD",
      },
      className: "alert-success",
      ...options,
    });
    return true;
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      style: {
        background: "#F8D7DA",
      },
      className: "alert-danger",
      ...options,
    });
    return false;
  },
  warn: (message: string, options?: ToastOptions) => {
    toast.warn(message, {
      style: {
        background: "#FFF3CD",
      },
      className: "alert-warning",
      ...options,
    });
    return false;
  },
};

export function getErrorFromResponse(e: any) {
  return e?.response?.data?.error ?? e?.message ?? e;
}

export function modal(id: ModalIds) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) {
    throw new Error("modal el could not be found");
  }

  return window.bootstrap.Modal.getInstance(el);
}

export function isCadFeatureEnabled(features: string[] | undefined, feature: string) {
  return features?.includes(feature.toLowerCase());
}
