import * as React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
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
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/members")}`}
            to="/admin/manage/members"
          >
            {lang.admin.member_management}
          </Link>
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/citizens")}`}
            to="/admin/manage/citizens"
          >
            {lang.admin.citizen_management}
          </Link>
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/companies")} `}
            to="/admin/manage/companies"
          >
            {lang.admin.company_management}
          </Link>
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/officers")} `}
            to="/admin/manage/officers"
          >
            Manage Officers
          </Link>
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/10-codes")} `}
            to="/admin/manage/10-codes"
          >
            10 Codes
          </Link>
          <Link
            className={`text-decoration-none admin-link ${isActive("/manage/penal-codes")} `}
            to="/admin/manage/penal-codes"
          >
            Penal Codes
          </Link>
          {user?.rank === "owner" ? (
            <Link
              className={`text-decoration-none admin-link ${isActive("/cad-settings")}`}
              to="/admin/cad-settings"
            >
              {lang.admin.cad_settings.cad_settings}
            </Link>
          ) : null}
        </div>

        <div style={item}>
          <header>
            <h3>{lang.admin.values.values}</h3>
          </header>
          <Link className="admin-link text-decoration-none" to="/admin/values/departments">
            {lang.admin.values.departments.index}
          </Link>
          <Link className="admin-link text-decoration-none" to="/admin/values/ethnicities">
            {lang.admin.values.ethnicities.index}
          </Link>
          <Link className="admin-link text-decoration-none" to="/admin/values/genders">
            {lang.admin.values.genders.index}
          </Link>
          <Link className="admin-link text-decoration-none" to="/admin/values/legal-statuses">
            {lang.admin.values["legal-statuses"].index}
          </Link>
          <Link className="admin-link text-decoration-none" to="/admin/values/vehicles">
            {lang.admin.values.vehicles.index}
          </Link>
          <Link className="admin-link text-decoration-none" to="/admin/values/weapons">
            {lang.admin.values.weapons.index}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps)(AdminSidebar);
