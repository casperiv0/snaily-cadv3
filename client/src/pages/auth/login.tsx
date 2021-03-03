import * as React from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/alert-message";
import State from "../../interfaces/State";
import ILoc from "../../interfaces/ILoc";
import lang from "../../language.json";
import { connect } from "react-redux";
import { login } from "../../lib/actions/auth";
import Message from "../../interfaces/Message";

interface Props {
  message: Message | null;
  loading: boolean;
  location: ILoc;
  login: (data: object, requestedPath: string) => void;
}

const Login: React.FC<Props> = ({ message, loading, location, login }) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const requestedPath = location?.state?.requestedPath;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    login(
      {
        username,
        password,
      },
      requestedPath,
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 mx-auto" style={{ width: "500px", maxWidth: "95%" }}>
      <AlertMessage message={message} dismissible />
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
  message: state.global.message,
});

export default connect(mapToProps, { login })(Login);
