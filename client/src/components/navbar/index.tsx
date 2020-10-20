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
    href: "/leo/ems-fd",
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

const Navbar: React.FC<Props> = ({
  loading,
  isAuth,
  checkAuth,
  logout,
  getCadInfo,
}) => {
  const currentPath = window.location.pathname;

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    getCadInfo();
  }, [getCadInfo]);

  return (
    <nav
      id="navbar"
      className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top"
    >
      <a className="navbar navbar-brand" href="/">
        Home
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navContent"
        aria-controls="navContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navContent">
        <ul className="navbar-nav mr-auto">
          {paths.map((path: Path, idx: number) => {
            return (
              <li id={`${idx}`} key={idx} className="nav-item">
                <a
                  className={
                    currentPath === path.href ? "nav-link active" : "nav-link"
                  }
                  href={path.href}
                >
                  {path.name}
                </a>
              </li>
            );
          })}
        </ul>

        <ul className="nav navbar-nav float-right">
          <li className="nav-item">
            <div className="dropdown">
              <button
                className="btn btn-secondary"
                type="button"
                data-toggle="dropdown"
                id="authDropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  style={{ width: "1.5rem", height: "1.5rem" }}
                  src="/img/avatar.svg"
                  alt="open menu"
                />
              </button>

              <div
                className="dropdown-menu dropdown-menu-right bg-dark border-dark"
                aria-labelledby="authDropdown"
              >
                {!loading && isAuth ? (
                  <div>
                    <a
                      className="dropdown-item bg-dark border-secondary text-light"
                      href="/account"
                    >
                      {lang.auth.account.account}
                    </a>
                    <div className="dropdown-divider bg-dark border-secondary"></div>
                    <button
                      onClick={logout}
                      className="dropdown-item bg-dark border-secondary text-light"
                    >
                      {lang.auth.logout}
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      className="dropdown-item bg-dark border-secondary text-light"
                      href="/login"
                    >
                      {lang.auth.login}
                    </a>
                    <a
                      className="dropdown-item bg-dark border-secondary text-light"
                      href="/register"
                    >
                      {lang.auth.register}
                    </a>
                  </>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export default connect(mapToProps, { checkAuth, logout, getCadInfo })(Navbar);
