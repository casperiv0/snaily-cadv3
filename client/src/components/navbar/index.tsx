import * as React from "react";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { checkAuth } from "../../lib/actions/auth";
import { getCadInfo } from "../../lib/actions/global";
import CadInfo from "../../interfaces/CadInfo";
import { Link, useLocation } from "react-router-dom";
import User from "../../interfaces/User";
import NotificationsCenter from "../notifications";

interface Props {
  isAuth: boolean;
  loading: boolean;
  checkAuth: () => void;
  getCadInfo: () => void;
  cadInfo: CadInfo | null;
  user: User | null;
}

interface Path {
  href: string;
  name: string;
  adminOnly?: boolean;
  show: (user: User | null) => boolean;
  enabled: (cad: CadInfo | null) => boolean;
}

export const paths: Path[] = [
  {
    href: "/leo/dash",
    name: lang.nav.police_dept,
    show: (user) => user?.leo === "1",
    enabled: () => true,
  },
  {
    href: "/dispatch",
    name: lang.nav.dispatch,
    show: (user) => user?.dispatch === "1",
    enabled: () => true,
  },
  {
    href: "/ems-fd/dash",
    name: lang.nav.ems_fd,
    show: (user) => user?.ems_fd === "1",
    enabled: () => true,
  },
  {
    href: "/citizen",
    name: lang.nav.citizen,
    show: () => true,
    enabled: () => true,
  },
  {
    href: "/tow",
    name: lang.nav.tow,
    show: () => true,
    enabled: (cad) => cad?.features.includes("tow") ?? true,
  },
  {
    href: "/truck-logs",
    name: lang.nav.trucklogs,
    show: () => true,
    enabled: (cad) => cad?.features.includes("truck-logs") ?? true,
  },
  {
    href: "/courthouse",
    name: lang.nav.courthouse,
    show: () => true,
    enabled: (cad) => cad?.features.includes("courthouse") ?? true,
  },
  {
    href: "/bleeter",
    name: lang.nav.bleeter,
    show: () => true,
    enabled: (cad) => cad?.features.includes("bleeter") ?? true,
  },
  {
    href: "/taxi",
    name: "Taxi",
    show: () => true,
    enabled: (cad) => cad?.features.includes("taxi") ?? true,
  },
];

const Navbar: React.FC<Props> = ({ loading, isAuth, cadInfo, user, checkAuth, getCadInfo }) => {
  const [showNotis, setShowNotis] = React.useState(false);
  const location = useLocation();
  const ref = React.useRef<HTMLButtonElement>(null);

  const isActive = React.useCallback(() => {
    const el = document.getElementById("nav-items");
    return el?.classList.contains("show");
  }, []);

  React.useEffect(() => {
    console.clear();
    checkAuth();
    getCadInfo();
  }, [location, checkAuth, getCadInfo]);

  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {cadInfo?.cad_name ? cadInfo?.cad_name : "Home"}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-items"
          aria-controls="nav-items"
          aria-expanded="false"
          aria-label="Toggle navigation"
          ref={ref}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav-items">
          <ul className="navbar-nav w-100">
            {paths.map((path: Path, idx: number) => {
              if (!path.enabled(cadInfo)) return null;

              if (!["admin", "owner", "moderator"].includes(`${user?.rank}`) && !path.show(user)) {
                return null;
              }

              return (
                <li id={path.name} key={idx} className="nav-item">
                  <Link
                    onClick={() => isActive() && ref.current?.click()}
                    className={"nav-link active text-light"}
                    to={path.href}
                  >
                    {path.name}
                  </Link>
                </li>
              );
            })}
            {user && ["admin", "owner", "moderator"].includes(user?.rank) ? (
              <li id="admin" key={paths.length + 1} className="nav-item">
                <Link className={"nav-link active text-light"} to="/admin">
                  {lang.nav.admin}
                </Link>
              </li>
            ) : null}
            <NavbarDropdown loading={loading} isAuth={isAuth} />
            <div className="nc-container">
              <button
                onClick={() => setShowNotis((v) => !v)}
                className="btn btn-secondary mx-1"
                type="button"
              >
                <img
                  style={{ width: "1.3rem", height: "1.3rem" }}
                  src="/img/notifications.svg"
                  alt="open menu"
                />
              </button>
              {showNotis ? (
                <NotificationsCenter closeNotifications={() => setShowNotis(false)} />
              ) : null}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavbarDropdown: React.FC<{ loading: boolean; isAuth: boolean }> = ({ loading, isAuth }) => {
  return (
    <li className="dropdown dropstart float-end">
      <button
        className="btn btn-secondary"
        type="button"
        id="navbarDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img style={{ width: "1.5rem", height: "1.5rem" }} src="/img/avatar.svg" alt="open menu" />
      </button>
      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
        {!loading && isAuth ? (
          <>
            <li>
              <Link className="dropdown-item" to="/account">
                {lang.auth.account.account}
              </Link>
            </li>
            <li className="dropdown-divider bg-dark border-secondary"></li>
            <li>
              <Link className="dropdown-item" to="/logout">
                {lang.auth.logout}
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="dropdown-item" to="/login">
                {lang.auth.login}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/register">
                {lang.auth.register}
              </Link>
            </li>
          </>
        )}
      </ul>
    </li>
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
  cadInfo: state.global.cadInfo,
  user: state.auth.user,
});

export default connect(mapToProps, { checkAuth, getCadInfo })(Navbar);
