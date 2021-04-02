import * as React from "react";

interface Props {
  fluid?: boolean;
  classes?: string;
}

const Layout: React.FC<Props> = ({ children, fluid, classes }) => {
  return (
    <div
      style={{ width: "100%" }}
      className={
        fluid
          ? `container-fluid mt-4 pb-4 ${classes ? classes : ""}`
          : `container mt-4 pb-4 ${classes ? classes : ""}`
      }
    >
      {children}
    </div>
  );
};

export default Layout;
