import { Dispatch } from "react";
import { handleRequest, isSuccess, notify } from "../functions";
import {
  DELETE_CITIZEN,
  DELETE_COMPANY,
  GET_CITIZENS,
  GET_COMPANIES,
  GET_MEMBERS,
  GET_MEMBER_BY_ID,
  UPDATE_MEMBER_PERMS,
  BAN_MEMBER,
  UN_BAN_MEMBER,
  ACCEPT_USER,
  DECLINE_USER,
  UPDATE_CAD_SETTINGS,
  GET_ALL_UNITS,
  GET_UNIT_BY_ID,
  ADMIN_UPDATE_UNIT,
  GET_ALl_EXPUNGEMENT_REQUESTS,
  ACCEPT_OR_DECLINE_REQUEST,
  GET_10_CODES,
  GET_PENAL_CODES,
  DELETE_10_CODE,
  UPDATE_10_CODE,
  DELETE_PENAL_CODE,
  REMOVE_USER,
  SET_ADMIN_LOADING,
  UPDATE_PENAL_CODES,
  GET_TEMP_PASSWORD,
  CREATE_PENAL_CODE,
  SOCKET_EVENTS,
} from "../types";
import lang from "../../language.json";
import Logger from "../Logger";
import Company from "../../interfaces/Company";
import Citizen from "../../interfaces/Citizen";
import User from "../../interfaces/User";
import socket from "../socket";
import Officer from "../../interfaces/Officer";
import { ExpungementRequest } from "./court";
import PenalCode from "../../interfaces/PenalCode";
import Code10 from "../../interfaces/Code10";
import Deputy from "../../interfaces/Deputy";

interface IDispatch {
  type: string;
  error?: string;
  companies?: Company[];
  citizens?: Citizen[];
  members?: User[];
  member?: User;
  officers?: Officer[];
  ems_fd?: Deputy[];
  officer?: Officer;
  expungementRequests?: ExpungementRequest[];
  codes?: Code10[];
  penalCodes?: PenalCode[];
  loading?: boolean;
  unit?: Officer | Deputy;
  tempPassword?: string;
}

export const getMembers = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/members", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MEMBERS,
        members: res.data.members,
      });
    }
  } catch (e) {
    Logger.error(GET_MEMBERS, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const getMemberById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest(`/admin/management/members/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MEMBER_BY_ID,
        member: res.data.member,
      });
    }
  } catch (e) {
    Logger.error(GET_MEMBER_BY_ID, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const updateMemberPerms = (id: string, data: Record<string, unknown>) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/admin/management/members/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_MEMBER_PERMS,
        member: res.data.member,
      });

      notify.success("Successfully updated member");
    }
  } catch (e) {
    Logger.error(UPDATE_MEMBER_PERMS, e);
  }
};

export const getTempPassword = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    dispatch({ type: SET_ADMIN_LOADING, loading: true });
    const res = await handleRequest(`/admin/management/members/temp-password/${id}`, "POST");

    if (isSuccess(res)) {
      dispatch({
        type: GET_TEMP_PASSWORD,
        tempPassword: res.data.tempPassword,
      });
    }
  } catch (e) {
    Logger.error(GET_TEMP_PASSWORD, e);
  }
};

export const banMember = (id: string, banReason: string) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/admin/management/members/ban/${id}`, "PUT", {
      ban_reason: banReason,
    });

    if (isSuccess(res)) {
      dispatch({
        type: BAN_MEMBER,
        member: res.data.member,
      });

      notify.success(`${lang.admin.ban_success} ${res.data.member?.username ?? "Unknown"}`);
    } else {
      notify.warn(res.data.error);
    }
  } catch (e) {
    Logger.error(BAN_MEMBER, e);
  }
};
export const unBanMember = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/members/unban/${id}`, "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: UN_BAN_MEMBER,
        member: res.data.member,
      });

      notify.success(`${lang.admin.un_ban_success} ${res.data.member?.username ?? "Unknown"}`);
    }
  } catch (e) {
    Logger.error(UN_BAN_MEMBER, e);
  }
};

export const removeUser = (id: string) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/admin/management/members/remove/${id}`, "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: REMOVE_USER,
      });

      notify.success(`Successfully removed user with ID: ${id}`);

      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(UN_BAN_MEMBER, e);
    return false;
  }
};

export const acceptUser = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/members/accept/${id}`, "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: ACCEPT_USER,
        members: res.data.members,
      });

      notify.success(lang.admin.accepted_member);
    }
  } catch (e) {
    Logger.error(ACCEPT_USER, e);
  }
};

export const declineUser = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/members/decline/${id}`, "PUT");

    if (isSuccess(res)) {
      dispatch({
        type: DECLINE_USER,
        members: res.data.members,
      });

      notify.success(lang.admin.declined_member);
    }
  } catch (e) {
    Logger.error(DECLINE_USER, e);
  }
};

export const getAllCitizens = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/citizens", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CITIZENS,
        citizens: res.data.citizens,
      });
    }
  } catch (e) {
    Logger.error(GET_CITIZENS, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const deleteCitizen = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/citizens/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_CITIZEN,
        citizens: res.data.citizens,
      });

      notify.success(lang.citizen.deleted_citizen);
    }
  } catch (e) {
    Logger.error(DELETE_CITIZEN, e);
  }
};

export const getCompanies = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/companies", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_COMPANIES,
        companies: res.data.companies || [],
      });
    }
  } catch (e) {
    Logger.error(GET_COMPANIES, e);

    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const deleteCompanyById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/companies/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_COMPANY,
        companies: res.data.companies,
      });

      notify.success(lang.admin.company.delete_success);
    }
  } catch (e) {
    Logger.error(DELETE_COMPANY, e);
  }
};

export interface UpdateCADSettings {
  aop: string;
  cad_name: string;
  whitelisted: string;
  tow_whitelisted: string;
  webhook_url: string;
  live_map_url: string;
  plate_length: number;
  steam_api_key: string;
  features: string[];
  max_citizens: string;
}

export const updateCadSettings = (data: UpdateCADSettings) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest("/admin/management/cad-settings", "PUT", data);

    if (isSuccess(res)) {
      socket.emit(SOCKET_EVENTS.UPDATE_AOP, data.aop);
      dispatch({
        type: UPDATE_CAD_SETTINGS,
      });

      notify.success(lang.admin.cad_settings.updated);
    }
  } catch (e) {
    Logger.error(UPDATE_CAD_SETTINGS, e);
  }
};

export const getAllUnits = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/units", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ALL_UNITS,
        officers: res.data.officers,
        ems_fd: res.data.ems_fd,
      });
    }
  } catch (e) {
    Logger.error(GET_ALL_UNITS, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const getUnitById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest(`/admin/management/units/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_UNIT_BY_ID,
        unit: {
          ...res.data.unit,
          logs: res.data.logs ?? [],
        },
      });
    }
  } catch (e) {
    Logger.error(GET_UNIT_BY_ID, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export interface UpdateOfficerData {
  callsign: string;
  rank: string;
  department: string;
  status: string;
  status2: string;
}

export const updateUnitById = (id: string, data: UpdateOfficerData) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/admin/management/units/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: ADMIN_UPDATE_UNIT,
      });

      notify.success("Successfully updated officer");
      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(GET_ALL_UNITS, e);
    notify.error(e);
    return false;
  }
};

export const getAllExpungementRequests = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/admin/management/expungement-requests", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ALl_EXPUNGEMENT_REQUESTS,
        expungementRequests: res.data.requests,
      });
    }
  } catch (e) {
    Logger.error(GET_ALl_EXPUNGEMENT_REQUESTS, e);
  }
};

export const acceptOrDeclineRequest = (
  type: "accept" | "decline",
  request: ExpungementRequest,
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(
      `/admin/management/expungement-requests/${request.id}/${type}`,
      "PUT",
      {
        warrants: request.warrants,
        arrestReports: request.arrestReports,
        tickets: request.tickets,
      },
    );

    if (isSuccess(res)) {
      dispatch({
        type: ACCEPT_OR_DECLINE_REQUEST,
        expungementRequests: res.data.requests,
      });

      notify.success(
        `Successfully ${type === "accept" ? "accepted" : "declined"} expungement request`,
      );
    } else {
      notify.error("An error occurred when accepting the request");
    }
  } catch (e) {
    Logger.error(ACCEPT_OR_DECLINE_REQUEST, e);
  }
};

export const getPenalCodes = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/penal-codes", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_PENAL_CODES,
        penalCodes: res.data.penalCodes,
      });
    }
  } catch (e) {
    Logger.error(GET_PENAL_CODES, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const addPenalCode = (data: Partial<PenalCode>) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/admin/management/penal-codes", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_PENAL_CODE,
        penalCodes: res.data.penalCodes,
      });

      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(CREATE_PENAL_CODE, e);
    notify.error(e);
    return false;
  }
};

export const deletePenalCode = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/penal-codes/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_PENAL_CODE,
        penalCodes: res.data.penalCodes,
      });

      notify.success("Successfully deleted penal code");
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
    notify.error(e);
  }
};

export const updatePenalCode = (id: string, data: Partial<PenalCode>) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest(`/admin/management/penal-codes/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_PENAL_CODES,
        penalCodes: res.data.penalCodes,
      });

      notify.success("Successfully updated penal code");

      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
    notify.error(e);
    return false;
  }
};

export const get10Codes = () => async (dispatch: Dispatch<IDispatch>) => {
  dispatch({ type: SET_ADMIN_LOADING, loading: true });

  try {
    const res = await handleRequest("/admin/management/10-codes", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_10_CODES,
        codes: res.data.codes,
      });
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
    dispatch({ type: SET_ADMIN_LOADING, loading: false });
  }
};

export const add10Code = (data: Partial<Code10>) => async (
  dispatch: Dispatch<IDispatch>,
): Promise<boolean> => {
  try {
    const res = await handleRequest("/admin/management/10-codes", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: GET_10_CODES,
        codes: res.data.codes,
      });

      notify.success("Successfully add 10 code");

      return true;
    } else {
      notify.warn(res.data.error);
      return false;
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
    return false;
  }
};

export const update10Code = (id: string, data: Partial<Code10>) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/admin/management/10-codes/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_10_CODE,
        codes: res.data.codes,
      });

      notify.success("Successfully updated 10 code");

      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
    return false;
  }
};

export const delete10Code = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/10-codes/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_10_CODE,
        codes: res.data.codes,
      });
    }
  } catch (e) {
    Logger.error(GET_10_CODES, e);
  }
};
