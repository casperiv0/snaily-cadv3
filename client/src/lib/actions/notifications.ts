import { Dispatch } from "react";
import Notification from "../../interfaces/Notification";
import { handleRequest, isSuccess } from "../functions";
import Logger from "../Logger";
import { GET_NOTIFICATIONS, REMOVE_NOTIFICATION } from "../types";

interface IDispatch {
  type: string;
  notifications?: Notification[];
}

export const getNotifications = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/notifications", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_NOTIFICATIONS,
        notifications: res.data.notifications,
      });
    }
  } catch (e) {
    Logger.error(GET_NOTIFICATIONS, e);
  }
};

export const removeNotification = (id: string) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/notifications/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: REMOVE_NOTIFICATION,
        notifications: res.data.notifications,
      });
    }
  } catch (e) {
    Logger.error(GET_NOTIFICATIONS, e);
  }
};
