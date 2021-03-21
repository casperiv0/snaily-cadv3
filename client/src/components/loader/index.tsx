import * as React from "react";
import ReactDOM from "react-dom";

interface Props {
  size?: number | string;
  fullScreen?: boolean;
}

const centerStyles: React.CSSProperties = {
  width: "100%",
  height: "10rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fullScreenStyles: React.CSSProperties = {
  position: "fixed",
  zIndex: 99999,
  width: "100%",
  height: "100vh",
  left: "0",
  top: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const element = document.getElementById("loader-portal");

const Loader: React.FC<Props> = ({ fullScreen }) => {
  return ReactDOM.createPortal(
    <div style={fullScreen ? fullScreenStyles : centerStyles}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>,
    element!,
  );
};

export default Loader;
