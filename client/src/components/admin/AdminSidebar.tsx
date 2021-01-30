import * as React from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import State from "../../interfaces/State";
import User from "../../interfaces/User";
import lang from "../../language.json";

const styles: React.CSSProperties = {
  width: "300px",
  position: "fixed",
  top: "50px",
  left: "0",
  bottom: "0",
  display: "flex",
  padding: "1rem",
};

const content: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  marginTop: "20px",
};

const item: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
};

interface Props {
  user: User;
}

const AdminSidebar: React.FC<Props> = ({ user }) => {
  const location = useLocation();

  function isActive(path: string): string {
    return `/admin${path}` === location.pathname ? "active" : "";
  }

  return (
    <nav style={styles} className="bg-dark" id="admin-nav">
      <div style={content}>
        <div style={item}>
          <header>
            <h3>{lang.admin.management}</h3>
          </header>
          <a
            className={`text-decoration-none admin-link ${isActive("/manage/members")}`}
            href="/admin/manage/members"
          >
            {lang.admin.member_management}
          </a>
          <a
            className={`text-decoration-none admin-link ${isActive("/manage/citizens")}`}
            href="/admin/manage/citizens"
          >
            {lang.admin.citizen_management}
          </a>
          <a
            className={`text-decoration-none admin-link ${isActive("/manage/companies")} `}
            href="/admin/manage/companies"
          >
            {lang.admin.company_management}
          </a>
          <a
            className={`text-decoration-none admin-link ${isActive("/manage/officers")} `}
            href="/admin/manage/officers"
          >
            Manage Officers
          </a>
          {user?.rank === "owner" ? (
            <a
              className={`text-decoration-none admin-link ${isActive("/cad-settings")}`}
              href="/admin/cad-settings"
            >
              {lang.admin.cad_settings.cad_settings}
            </a>
          ) : null}
        </div>

        <div style={item}>
          <header>
            <h3>{lang.admin.values.values}</h3>
          </header>
          <a className="admin-link text-decoration-none" href="/admin/values/departments">
            {lang.admin.values.departments.index}
          </a>
          <a className="admin-link text-decoration-none" href="/admin/values/ethnicities">
            {lang.admin.values.ethnicities.index}
          </a>
          <a className="admin-link text-decoration-none" href="/admin/values/genders">
            {lang.admin.values.genders.index}
          </a>
          <a className="admin-link text-decoration-none" href="/admin/values/legal-statuses">
            {lang.admin.values["legal-statuses"].index}
          </a>
          <a className="admin-link text-decoration-none" href="/admin/values/vehicles">
            {lang.admin.values.vehicles.index}
          </a>
          <a className="admin-link text-decoration-none" href="/admin/values/weapons">
            {lang.admin.values.weapons.index}
          </a>
        </div>
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps)(AdminSidebar);
