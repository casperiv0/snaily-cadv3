import { SelectValue } from "components/Select/Select";
import axios from "axios";
import { toast, ToastOptions } from "react-toastify";
import { Call } from "types/Call";
import { Code10 } from "types/Code10";
import { ModalIds } from "types/ModalIds";
import { PenalCode } from "types/PenalCode";

export type RequestData = Record<string, unknown>;
export type AllowedMethods = "PATCH" | "PUT" | "DELETE" | "OPTIONS" | "GET" | "POST";

export function handleRequest(
  path: string,
  method: AllowedMethods = "GET",
  data: RequestData | any = {},
) {
  const host =
    process?.env?.NEXT_PUBLIC_CUSTOM_HOST !== "undefined"
      ? process.env.NEXT_PUBLIC_SECURE_COOKIES
      : data?.host;

  const protocol =
    data?.host &&
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_SECURE_COOKIES === "true"
      ? "https://"
      : "http://";
  const url = data?.host ? `${protocol}${host}/` : "/";

  return axios({
    url: `${url}api${path}`,
    method,
    data: data ? data : null,
    withCredentials: true,
    headers: {
      Session: data?.cookie ?? "",
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
  if (typeof window === "undefined") return null;
  const el = document.getElementById(id);
  if (!el) {
    throw new Error("modal el could not be found");
  }

  return window.bootstrap.Modal.getInstance(el);
}

export function isCadFeatureEnabled(features: string[] | undefined, feature: string) {
  return features?.includes(feature.toLowerCase());
}

export function playSound(src: string) {
  const audio = new Audio(src);
  audio.volume = 0.7;

  const play = () => {
    audio.play();

    return true;
  };

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;

    return true;
  };

  return { stop, play, audio };
}

export function filterCodes(codes: Code10[]) {
  return codes.sort((a, b) => {
    if (a.position && b.position) {
      return a.position - b.position;
    }
    b.position = 0;
    a.position = 0;

    return a.position - b.position;
  });
}

export function isUnitAlreadyAssigned(unitId: string, calls: Call[]) {
  const unitIds = calls.flatMap((call) => call.assigned_unit.map((v) => v.value));

  return unitIds.includes(unitId);
}

export function getPenalCodesFromSelectValues(
  values: SelectValue[] | string[],
  penalCodes: PenalCode[],
) {
  return values.map(
    (c: string | SelectValue) =>
      penalCodes.find((v) => v.title === (typeof c === "string" ? c : c.value)) ??
      ({} as PenalCode),
  );
}

export function getTotalJailTimeAndFineAmount(codes: PenalCode[]) {
  const jailTime = codes
    .filter((v) => v.jail_time)
    .reduce((ac, cv) => ac + Number(cv.jail_time), 0);
  const fineAmount = codes
    .filter((v) => v.fine_amount)
    .reduce((ac, cv) => ac + Number(cv.fine_amount), 0);

  return {
    fineAmount,
    jailTime,
  };
}
