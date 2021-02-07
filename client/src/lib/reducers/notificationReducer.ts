import State from "../../interfaces/State";
import { GET_NOTIFICATIONS, REMOVE_NOTIFICATION } from "../types";
import Notification from "../../interfaces/Notification";

const initState: State["notifications"] = {
  items: [],
};

type Actions =
  | {
      type: typeof GET_NOTIFICATIONS;
      notifications: Notification[];
    }
  | {
      type: typeof REMOVE_NOTIFICATION;
      notifications: Notification[];
    };

export default function notificationReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_NOTIFICATIONS":
      return {
        ...state,
        items: action.notifications,
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        items: action.notifications,
      };
    default:
      return {
        ...state,
      };
  }
}
