import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import State from "../../interfaces/State";
import ILoc from "../../interfaces/ILoc";
import lang from "../../language.json";
import { connect } from "react-redux";
import { login } from "../../lib/actions/auth";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  loading: boolean;
  location: ILoc;
  login: (data: object, requestedPath: string) => Promise<boolean | string>;
}

const Login: React.FC<Props> = ({ loading, location, login }) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const requestedPath = location?.state?.requestedPath;
  const history = useHistory();
  useDocTitle("Login");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await login(
      {
        username,
        password,
      },
      requestedPath,
    );

    if (typeof success === "string") {
      history.push(success);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 mx-auto" style={{ width: "500px", maxWidth: "95%" }}>
      <h2>{lang.auth.login_2}</h2>
      <div className="mb-3">
        <label className="form-label" htmlFor="username">
          {lang.auth.enter_username}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">
          {lang.auth.enter_password}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <Link to="/register">{lang.auth.register}</Link>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary float-end w-100 auth-btn mt-2"
        >
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            lang.auth.login
          )}
        </button>
      </div>
    </form>
  );
};

const mapToProps = (state: State) => ({
  loading: state.auth.loading,
});

export default connect(mapToProps, { login })(Login);
