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
      } = {},
) {
  return axios({
    url: `${process.env.NEXT_PUBLIC_PROD_ORIGIN}/api${path}`,
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
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      style: {
        background: "#F8D7DA",
      },
      className: "alert-danger",
      ...options,
    });
  },
  warn: (message: string, options?: ToastOptions) => {
    toast.warn(message, {
      style: {
        background: "#FFF3CD",
      },
      className: "alert-warning",
      ...options,
    });
  },
};

export function getErrorFromResponse(e: any) {
  return e?.response?.data?.error ?? e;
}

export function modal(id: ModalIds) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) {
    throw new Error("modal el could not be found");
  }

  return window.bootstrap.Modal.getInstance(el);
}

export function generateString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const allChars = chars;

  for (let i = 0; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return result;
}
