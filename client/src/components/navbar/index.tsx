import * as React from "react";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { checkAuth, logout } from "../../lib/actions/auth";
import { getCadInfo } from "../../lib/actions/global";

interface Props {
  isAuth: boolean;
  loading: boolean;
  checkAuth: () => void;
  logout: () => void;
  getCadInfo: () => void;
}

interface Path {
  href: string;
  name: string;
  adminOnly: boolean;
}

export const paths: Path[] = [
  {
    href: "/leo/dash",
    name: lang.nav.police_dept,
    adminOnly: false,
  },
  {
    href: "/dispatch",
    name: lang.nav.dispatch,
    adminOnly: false,
  },
  {
    href: "/ems-fd/dash",
    name: lang.nav.ems_fd,
    adminOnly: false,
  },
  {
    href: "/citizen",
    name: lang.nav.citizen,
    adminOnly: false,
  },
  {
    href: "/tow",
    name: lang.nav.tow,
    adminOnly: false,
  },
  {
    href: "/truck-logs",
    name: lang.nav.trucklogs,
    adminOnly: false,
  },
  {
    href: "/bleeter",
    name: lang.nav.bleeter,
    adminOnly: false,
  },
  {
    href: "/admin",
    name: lang.nav.admin,
    adminOnly: true,
  },
];

const Navbar: React.FC<Props> = ({ loading, isAuth, checkAuth, logout, getCadInfo }) => {
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    getCadInfo();
  }, [getCadInfo]);

  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-items"
          aria-controls="nav-items"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav-items">
          <ul className="navbar-nav">
            {paths.map((path: Path, idx: number) => {
              return (
                <li id={path.name} key={idx} className="nav-item">
                  <a className={"nav-link active text-light"} href={path.href}>
                    {path.name}
                  </a>
                </li>
              );
            })}
            <NavbarDropdown loading={loading} isAuth={isAuth} />
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavbarDropdown: React.FC<{ loading: boolean; isAuth: boolean }> = ({ loading, isAuth }) => {
  return (
    <div className="dropdown dropstart float-end">
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
              <a className="dropdown-item" href="/account">
                {lang.auth.account.account}
              </a>
            </li>
            <li className="dropdown-divider bg-dark border-secondary"></li>
            <li>
              <button onClick={logout} className="dropdown-item">
                {lang.auth.logout}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a className="dropdown-item" href="/login">
                {lang.auth.login}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/register">
                {lang.auth.register}
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export default connect(mapToProps, { checkAuth, logout, getCadInfo })(Navbar);
