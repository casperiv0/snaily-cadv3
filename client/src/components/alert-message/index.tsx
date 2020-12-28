import * as React from "react";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import { dismissMessage } from "../../lib/actions/global";

interface Props {
  message: Message;
  dismissMessage: () => void;
  dismissible?: boolean;
}

const AlertMessage: React.FC<Props> = ({ message, dismissible, dismissMessage }) => {
  return message === null ? null : (
    <div
      className={`alert alert-${message?.type} ${dismissible && "alert-dismissible"}`}
      role="alert"
    >
      {message?.msg}

      {dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={dismissMessage}
        ></button>
      )}
    </div>
  );
};

export default connect(null, { dismissMessage })(AlertMessage);
