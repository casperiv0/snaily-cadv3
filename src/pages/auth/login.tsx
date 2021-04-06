import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import lang from "../../language.json";
import { login } from "@actions/auth/AuthActions";
import { State } from "types/State";

interface Props {
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<boolean>;
}

const LoginPage = ({ loading, login }: Props) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await login({
      username,
      password,
    });

    if (success === true) {
      router.push("/");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto"
      style={{ width: "500px", maxWidth: "95%" }}
    >
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
        <Link href="/auth/register">
          <a>{lang.auth.register}</a>
        </Link>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary float-end w-100 auth-btn mt-2"
        >
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">{lang.global.loading}...</span>
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

export default connect(mapToProps, { login })(LoginPage);
