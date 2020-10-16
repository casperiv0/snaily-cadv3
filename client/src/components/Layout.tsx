import * as React from "react";

interface Props {
  fluid?: boolean;
}

const Layout: React.FC<Props> = ({ children, fluid }) => {
  return (
    <div className={fluid ? "container-fluids" : "container"}>{children}</div>
  );
};

export default Layout;
