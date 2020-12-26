import * as React from "react";

interface Props {
  size?: number | string;
  fullScreen?: boolean;
}

const centerStyles: React.CSSProperties = {
  width: "100vw",
  height: "10rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fullScreenStyles: React.CSSProperties = {
  position: "fixed",
  zIndex: 50,
  width: "100%",
  height: "100vh",
  left: "0",
  top: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Loader: React.FC<Props> = ({ fullScreen }) => {
  return (
    <div style={fullScreen ? fullScreenStyles : centerStyles}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
