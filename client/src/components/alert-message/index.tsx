import * as React from "react";
import { connect } from "react-redux";
import { dismissMessage } from "../../lib/actions/global";

interface Props {
  type: "warning" | "danger" | "success";
  message: string;
  dismissMessage: () => void;
  dismissible?: boolean;
}

const AlertMessage: React.FC<Props> = ({ type, message, dismissible, dismissMessage }) => {
  return (
    <div className={`alert alert-${type} ${dismissible && "alert-dismissible"}`} role="alert">
      {message}

      {dismissible && (
        <button
          type="button"
          onClick={dismissMessage}
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

export default connect(null, { dismissMessage })(AlertMessage);
