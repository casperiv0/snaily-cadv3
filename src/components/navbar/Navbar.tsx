import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { User } from "types/User";
import { Cad } from "types/Cad";
import { NavbarDropdown } from "./NavbarDropdown";
import { logger } from "lib/logger";

interface Props {
  isAuth: boolean;
  cadInfo: Nullable<Cad>;
  user: Nullable<User>;
}

interface Path {
  href: string;
  name: string;
  adminOnly?: boolean;
  show: (user: User | null) => boolean;
  enabled: (cad: Cad | null) => boolean;
}

const pages = ["/404", "/", "/403", "/auth/login", "/auth/register"];

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
    name: lang.nav.taxi,
    show: () => true,
    enabled: (cad) => cad?.features.includes("taxi") ?? true,
  },
];

const NavbarC = ({ isAuth, cadInfo, user }: Props) => {
  const router = useRouter();
  const ref = React.useRef<HTMLButtonElement>(null);

  const isActive = React.useCallback(() => {
    const el = document.getElementById("nav-items");
    return el?.classList.contains("show");
  }, []);

  React.useEffect(() => {
    console.clear();

    if (cadInfo?.version) {
      logger.log(
        "VERSION",
        `
  - Your version: ${cadInfo?.version?.version}
  - Updated version: ${cadInfo?.version?.updatedVersion}`,
      );
    }
  }, [cadInfo?.version]);

  React.useEffect(() => {
    if (pages.includes(router.pathname)) return;
    if (!isAuth) {
      router.push("/auth/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  if (!isAuth) {
    return null;
  }

  return (
    <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top">
      <div className="container-fluid">
        <Link href="/citizen">
          <a className="navbar-brand">{cadInfo?.cad_name ? cadInfo?.cad_name : "Home"}</a>
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
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav-items">
          <div className="navbar-nav w-100">
            <ul className="navbar-nav w-100">
              {paths.map((path: Path, idx: number) => {
                if (!path.enabled(cadInfo)) return null;

                if (
                  !["admin", "owner", "moderator"].includes(`${user?.rank}`) &&
                  !path.show(user)
                ) {
                  return null;
                }

                return (
                  <li id={path.name} key={idx} className="nav-item">
                    <Link href={path.href}>
                      <a
                        onClick={() => isActive() && ref.current?.click()}
                        className={"nav-link active text-light"}
                      >
                        {path.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
              {(user && ["admin", "owner", "moderator"].includes(user?.rank)) ||
              user?.supervisor === "1" ? (
                <li id="admin" key={paths.length + 1} className="nav-item">
                  {["admin", "owner", "moderator"].includes(user.rank) ? (
                    <Link href="/admin">
                      <a className="nav-link active text-light">{lang.nav.admin}</a>
                    </Link>
                  ) : (
                    <Link href="/admin/manage/units">
                      <a className="nav-link active text-light">{lang.nav.leo_management}</a>
                    </Link>
                  )}
                </li>
              ) : null}
            </ul>
            <NavbarDropdown isAuth={isAuth} />
          </div>

          {/* <div className="nc-container">
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
            </div> */}
        </div>
      </div>
    </nav>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
  isAuth: state.auth.isAuth,
  cadInfo: state.global?.cadInfo,
});

export const Navbar = connect(mapToProps)(NavbarC);
