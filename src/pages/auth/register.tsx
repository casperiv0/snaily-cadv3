import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import lang from "../../language.json";
import { register } from "@actions/auth/AuthActions";
import { Seo } from "@components/Seo";

interface Props {
  register: (data: { username: string; password: string; password2: string }) => Promise<boolean>;
}

const RegisterPage = ({ register }: Props) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await register({
      username,
      password,
      password2,
    });

    if (success === true) {
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto"
      style={{ width: "500px", maxWidth: "95%" }}
    >
      <Seo title={lang.auth.register} />
      <h2>{lang.auth.register}</h2>
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
        <label className="form-label" htmlFor="password2">
          {lang.auth.confirm_password}
        </label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          id="password2"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <Link href="/auth/login">
          <a>{lang.auth.login}</a>
        </Link>
        <button type="submit" className="btn btn-primary float-end w-100 mt-2">
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">{lang.global.loading}...</span>
            </div>
          ) : (
            lang.auth.register
          )}
        </button>
      </div>
    </form>
  );
};

export default connect(null, { register })(RegisterPage);
