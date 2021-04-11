import * as React from "react";
import { AdminSidebar } from "./AdminSidebar";

const containerStyles: React.CSSProperties = {
  width: "100%",
};

const sidebarContainer: React.CSSProperties = {
  width: "300px",
  height: "100%",
};

export const AdminLayout: React.FC = ({ children }) => {
  return (
    <div className="d-flex" style={containerStyles}>
      <div style={sidebarContainer}>
        <AdminSidebar />
      </div>
      <div className="mt-4 me-3 ms-3 col">{children}</div>
    </div>
  );
};
