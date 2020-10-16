import * as React from "react";

interface Props {
  size?: number | string;
  fullScreen?: boolean;
}

const Loader: React.FC<Props> = ({ fullScreen }) => {
  return (
    <div className={fullScreen ? "d-flex flex-centerF mx-auto" : ""}>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
