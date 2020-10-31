import * as React from "react";
import AlertMessage from "../../components/alert-message";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { register } from "../../lib/actions/auth";

interface Props {
  error: string;
  loading: boolean;
  register: (data: object) => void;
}

const Register: React.FC<Props> = ({ error, loading, register }) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    register({
      username,
      password,
      password2,
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 mx-auto" style={{ width: "500px", maxWidth: "95%" }}>
      <h2>{lang.auth.register}</h2>
      <div className="form-group">
        {error ? <AlertMessage type="warning" message={error} dismissible /> : null}
      </div>
      <div className="form-group">
        <label htmlFor="username">{lang.auth.enter_username}</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">{lang.auth.enter_password}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password2">{lang.auth.confirm_password}</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          id="password2"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <a href="/login">{lang.auth.login}</a>
        <button type="submit" className="btn btn-primary float-right w-100 mt-2">
          {loading ? (
            <span className="spinner-border primary">
              <span className="sr-only">loading</span>
            </span>
          ) : (
            lang.auth.register
          )}
        </button>
      </div>
    </form>
  );
};

const mapToProps = (state: State) => ({
  error: state.auth.error,
  loading: state.auth.loading,
});

export default connect(mapToProps, { register })(Register);
