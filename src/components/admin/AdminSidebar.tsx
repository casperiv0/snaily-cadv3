import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Nullable, State } from "types/State";
import { User } from "types/User";
import lang from "src/language.json";

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
  user: Nullable<User>;
}

const ranks = ["owner", "admin", "moderator"];

interface Page {
  name: string;
  href: string;
  allowed: (user: User) => boolean;
}

const pages: Page[] = [
  {
    name: lang.admin.member_management,
    href: "/admin/manage/members",
    allowed: (user) => ranks.includes(user.rank!),
  },
  {
    name: lang.admin.citizen_management,
    href: "/admin/manage/citizens",
    allowed: (user) => ranks.includes(user.rank!),
  },
  {
    name: lang.admin.company_management,
    href: "/admin/manage/companies",
    allowed: (user) => ranks.includes(user.rank!),
  },
  {
    name: lang.officers.incidents,
    href: "/admin/manage/incidents",
    allowed: (user) => ranks.includes(user.rank!),
  },
  {
    name: lang.admin.supervisor_panel,
    href: "/admin/manage/units",
    allowed: (user) => ranks.includes(user.rank) || user.supervisor === "1",
  },
  {
    name: lang.codes.codes_10,
    href: "/admin/manage/10-codes",
    allowed: (user) => ranks.includes(user.rank) || user.supervisor === "1",
  },
  {
    name: lang.codes.penal_codes,
    href: "/admin/manage/penal-codes",
    allowed: (user) => ranks.includes(user.rank) || user.supervisor === "1",
  },
  {
    name: lang.admin.cad_settings.cad_settings,
    href: "/admin/cad-settings",
    allowed: (user) => user.rank === "owner",
  },
];

const AdminSidebarC: React.FC<Props> = ({ user }) => {
  const location = useRouter();

  function isActive(path: string): string {
    return path === location.asPath ? "active" : "";
  }

  return (
    <nav style={styles} className="bg-dark" id="admin-nav">
      <div style={content}>
        <div style={item}>
          <header>
            <h3>{lang.admin.management}</h3>
          </header>

          {pages.map((page, idx) => {
            if (page.allowed(user ?? ({} as User))) {
              return (
                <Link key={idx} href={page.href}>
                  <a
                    className={`text-decoration-none p-2 rounded admin-link ${isActive(page.href)}`}
                  >
                    {page.name}
                  </a>
                </Link>
              );
            } else {
              return null;
            }
          })}
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
