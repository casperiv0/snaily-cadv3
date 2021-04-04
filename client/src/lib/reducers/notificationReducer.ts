import State from "../../interfaces/State";
import { GET_NOTIFICATIONS, REMOVE_NOTIFICATION } from "../types";
import Notification from "../../interfaces/Notification";

const initState: State["notifications"] = {
  items: [],
};

type Actions = {
  type: typeof GET_NOTIFICATIONS | typeof REMOVE_NOTIFICATION;
  notifications: Notification[];
};

export default function notificationReducer(
  state = initState,
  action: Actions,
): State["notifications"] {
  switch (action.type) {
    case "REMOVE_NOTIFICATION":
    case "GET_NOTIFICATIONS":
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
