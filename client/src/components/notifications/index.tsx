import { FC, useEffect } from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import "./styles.css";
import Notification from "../../interfaces/Notification";
import { getNotifications, removeNotification } from "../../lib/actions/notifications";
import { Link } from "react-router-dom";

interface Props
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  notifications: Notification[];
  getNotifications: () => void;
  removeNotification: (id: string) => void;
  closeNotifications: () => void;
}

const NotificationsCenter: FC<Props> = ({
  notifications,
  getNotifications,
  removeNotification,
  closeNotifications,
}) => {
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <div className="nc-content">
      <h1 className="h2">{window.lang.notifications.center}</h1>
      {notifications.length <= 0 ? (
        <p>{window.lang.notifications.no_notifications}</p>
      ) : (
        notifications.map((notification) => {
          return (
            <Link
              onClick={() => {
                removeNotification(notification.id);
                closeNotifications();
              }}
              to={notification.href}
              key={notification.id}
              className="nc-item"
            >
              <h1 className="h4">{notification.title}</h1>

              <p>{notification.text}</p>
            </Link>
          );
        })
      )}
    </div>
  );
};

const mapToProps = (state: State) => ({
  notifications: state.notifications.items,
});

export default connect(mapToProps, { getNotifications, removeNotification })(NotificationsCenter);
