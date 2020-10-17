import * as React from "react";
import AlertMessage from "../../components/alert-message";
import State from "../../interfaces/State";
import ILoc from "../../interfaces/ILoc";
import { connect } from "react-redux";
import { login } from "../../lib/actions/auth";

interface Props {
  error: string;
  location: ILoc;
  login: (data: object, requestedPath: string) => void;
}

const Login: React.FC<Props> = ({ error, login, location }) => {
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
      requestedPath
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 mx-auto"
      style={{ width: "500px", maxWidth: "95%" }}
    >
      <div className="form-group">
        {error ? <AlertMessage type="warning" message={error} /> : null}
      </div>
      <div className="form-group">
        <label htmlFor="username">Enter username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">Enter password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary float-right w-100">
          Login
        </button>
      </div>
    </form>
  );
};

const mapToProps = (state: State) => ({
  error: state.auth.error,
});

export default connect(mapToProps, { login })(Login);
