import * as React from "react";

interface Props {
  type: "warning" | "danger" | "success";
  message: string;
}

const AlertMessage: React.FC<Props> = ({ type, message }) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
