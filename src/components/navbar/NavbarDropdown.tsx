import Link from "next/link";
import lang from "src/language.json";

export const NavbarDropdown: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
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
        {isAuth ? (
          <>
            <li>
              <Link href="/account">
                <a className="dropdown-item">{lang.auth.account.account}</a>
              </Link>
            </li>
            <li className="dropdown-divider bg-dark border-secondary"></li>
            <li>
              <Link href="/auth/logout">
                <a className="dropdown-item">{lang.auth.logout}</a>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/auth/login">
                <a className="dropdown-item">{lang.auth.login}</a>
              </Link>
            </li>
            <li>
              <Link href="/auth/register">
                <a className="dropdown-item">{lang.auth.register}</a>
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
