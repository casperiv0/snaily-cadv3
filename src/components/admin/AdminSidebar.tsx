import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { State } from "types/State";
import { User } from "types/User";
import lang from "../../language.json";

const styles: React.CSSProperties = {
  width: "300px",
  position: "fixed",
  top: "50px",
  left: "0",
  bottom: "0",
  display: "flex",
  padding: "1rem",
  overflow: "auto",
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
  user: User | null;
}

const ranks = ["owner", "admin", "moderator"];

const AdminSidebarC: React.FC<Props> = ({ user }) => {
  const location = useRouter();

  function isActive(path: string): string {
    return `/admin${path}` === location.asPath ? "active" : "";
  }

  return (
    <nav style={styles} className="bg-dark" id="admin-nav">
      <div style={content}>
        <div style={item}>
          <header>
            <h3>{lang.admin.management}</h3>
          </header>
          {ranks.includes(user?.rank!) ? (
            <>
              <Link href="/admin/manage/members">
                <a
                  className={`text-decoration-none p-2 rounded admin-link ${isActive(
                    "/manage/members",
                  )}`}
                >
                  {lang.admin.member_management}
                </a>
              </Link>
              <Link href="/admin/manage/citizens">
                <a
                  className={`text-decoration-none p-2 rounded admin-link ${isActive(
                    "/manage/citizens",
                  )}`}
                >
                  {lang.admin.citizen_management}
                </a>
              </Link>
              <Link href="/admin/manage/companies">
                <a
                  className={`text-decoration-none p-2 rounded admin-link ${isActive(
                    "/manage/companies",
                  )} `}
                >
                  {lang.admin.company_management}
                </a>
              </Link>
              <Link href="/admin/manage/incidents">
                <a
                  className={`text-decoration-none p-2 rounded admin-link ${isActive(
                    "/manage/incidents",
                  )} `}
                >
                  {lang.officers.incidents}
                </a>
              </Link>
            </>
          ) : null}

          <Link href="/admin/manage/units">
            <a
              className={`text-decoration-none p-2 rounded admin-link ${isActive(
                "/manage/units",
              )} `}
            >
              {lang.admin.supervisor_panel}
            </a>
          </Link>
          <Link href="/admin/manage/10-codes">
            <a
              className={`text-decoration-none p-2 rounded admin-link ${isActive(
                "/manage/10-codes",
              )} `}
            >
              {lang.codes.codes_10}
            </a>
          </Link>
          <Link href="/admin/manage/penal-codes">
            <a
              className={`text-decoration-none p-2 rounded admin-link ${isActive(
                "/manage/penal-codes",
              )} `}
            >
              {lang.codes.penal_codes}
            </a>
          </Link>
          {user?.rank === "owner" ? (
            <Link href="/admin/cad-settings">
              <a
                className={`text-decoration-none p-2 rounded admin-link ${isActive(
                  "/cad-settings",
                )}`}
              >
                {lang.admin.cad_settings.cad_settings}
              </a>
            </Link>
          ) : null}
        </div>

        {ranks.includes(user?.rank!) ? (
          <div style={item}>
            <header>
              <h3>{lang.admin.values.values}</h3>
            </header>
            <Link href="/admin/values/departments">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/departments",
                )}`}
              >
                {lang.admin.values.departments.index}
              </a>
            </Link>
            <Link href="/admin/values/ethnicities">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/ethnicities",
                )}`}
              >
                {lang.admin.values.ethnicities.index}
              </a>
            </Link>
            <Link href="/admin/values/genders">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/genders",
                )}`}
              >
                {lang.admin.values.genders.index}
              </a>
            </Link>
            <Link href="/admin/values/legal-statuses">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/legal-statuses",
                )}`}
              >
                {lang.admin.values["legal-statuses"].index}
              </a>
            </Link>
            <Link href="/admin/values/cad-licenses">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/cad-licenses",
                )}`}
              >
                {lang.admin.values["cad-licenses"].index}
              </a>
            </Link>
            <Link href="/admin/values/vehicles">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/vehicles",
                )}`}
              >
                {lang.admin.values.vehicles.index}
              </a>
            </Link>
            <Link href="/admin/values/weapons">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/weapons",
                )}`}
              >
                {lang.admin.values.weapons.index}
              </a>
            </Link>
            <Link href="/admin/values/call-types">
              <a
                className={`admin-link text-decoration-none p-2 rounded  ${isActive(
                  "/values/call-types",
                )}`}
              >
                {lang.admin.values["call-types"].index}
              </a>
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export const AdminSidebar = connect(mapToProps)(AdminSidebarC);
