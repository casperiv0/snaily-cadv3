import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import {
  DELETE_CITIZEN,
  DELETE_COMPANY,
  GET_CITIZENS,
  GET_COMPANIES,
  SET_MESSAGE,
  GET_MEMBERS,
  GET_MEMBER_BY_ID,
  UPDATE_MEMBER_PERMS,
  BAN_MEMBER,
  UN_BAN_MEMBER,
  ACCEPT_USER,
  DECLINE_USER,
  UPDATE_CAD_SETTINGS,
  GET_ALL_OFFICERS,
  GET_OFFICER_BY_ID,
  ADMIN_UPDATE_OFFICER,
} from "../types";
import lang from "../../language.json";
import Logger from "../Logger";
import Company from "../../interfaces/Company";
import Citizen from "../../interfaces/Citizen";
import User from "../../interfaces/User";
import socket from "../socket";
import Message from "../../interfaces/Message";
import Officer from "../../interfaces/Officer";

interface IDispatch {
  type: string;
  message?: Message;
  error?: string;
  companies?: Company[];
  citizens?: Citizen[];
  members?: User[];
  member?: User;
  officers?: Officer[];
  officer?: Officer;
}

export const getMembers = () => async (dispatch: Dispatch<IDispatch>) => {
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
  }
};

export const getMemberById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
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
  }
};

export const updateMemberPerms = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/admin/management/members/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_MEMBER_PERMS,
        member: res.data.member,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: "Successfully updated", type: "success" },
      });
    }
  } catch (e) {
    Logger.error(UPDATE_MEMBER_PERMS, e);
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.admin.ban_success} ${res.data.member?.username}`, type: "success" },
      });
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
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
      dispatch({
        type: SET_MESSAGE,
        message: {
          msg: `${lang.admin.un_ban_success} ${res.data.member?.username}`,
          type: "success",
        },
      });
    }
  } catch (e) {
    Logger.error(UN_BAN_MEMBER, e);
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.admin.accepted_member}`, type: "success" },
      });
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: `${lang.admin.declined_member}`, type: "success" },
      });
    }
  } catch (e) {
    Logger.error(DECLINE_USER, e);
  }
};

export const getAllCitizens = () => async (dispatch: Dispatch<IDispatch>) => {
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: lang.citizen.deleted_citizen, type: "success" },
      });
    }
  } catch (e) {
    Logger.error(DELETE_CITIZEN, e);
  }
};

export const getCompanies = () => async (dispatch: Dispatch<IDispatch>) => {
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
      dispatch({
        type: SET_MESSAGE,
        message: { msg: lang.admin.company.delete_success, type: "success" },
      });
    }
  } catch (e) {
    Logger.error(DELETE_COMPANY, e);
  }
};

export const updateCadSettings = (data: {
  aop: string;
  cad_name: string;
  whitelisted: string;
  tow_whitelisted: string;
  company_whitelisted: string;
  webhook_url: string;
}) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/admin/management/cad-settings", "PUT", data);

    if (isSuccess(res)) {
      socket.emit("UPDATE_AOP", data.aop);
      dispatch({
        type: UPDATE_CAD_SETTINGS,
      });
      dispatch({
        type: SET_MESSAGE,
        message: { msg: lang.admin.cad_settings?.updated, type: "success" },
      });
    }
  } catch (e) {
    Logger.error(UPDATE_CAD_SETTINGS, e);
  }
};

export const getAllOfficers = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/admin/management/officers", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_ALL_OFFICERS,
        officers: res.data.officers,
      });
    }
  } catch (e) {
    Logger.error(GET_ALL_OFFICERS, e);
  }
};

export const getOfficerById = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/admin/management/officers/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_OFFICER_BY_ID,
        officer: res.data.officer,
      });
    }
  } catch (e) {
    Logger.error(GET_ALL_OFFICERS, e);
  }
};

export interface UpdateOfficerData {
  callsign: string;
}

export const updateOfficerById = (id: string, data: UpdateOfficerData) => async (
  dispatch: Dispatch<IDispatch>,
) => {
  try {
    const res = await handleRequest(`/admin/management/officers/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: ADMIN_UPDATE_OFFICER,
      });

      return (window.location.href = "/admin/manage/officers");
    } else {
      dispatch({
        type: SET_MESSAGE,
        message: { msg: res.data.error, type: "warning" },
      });
    }
  } catch (e) {
    Logger.error(GET_ALL_OFFICERS, e);
  }
};
