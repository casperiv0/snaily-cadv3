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
          ? `container-fluid mt-5 pb-5 ${classes ? classes : ""}`
          : `container mt-5 pb-5 ${classes ? classes : ""}`
      }
    >
      {children}
    </div>
  );
};

export default Layout;
