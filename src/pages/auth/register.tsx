import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import lang from "../../language.json";
import { register } from "actions/auth/AuthActions";
import { Seo } from "components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "state/useStore";
import { getCadInfo } from "actions/global/GlobalActions";
import { Nullable, State } from "types/State";
import { Cad } from "types/Cad";
import { RequestData } from "lib/utils";

interface Props {
  cadInfo: Nullable<Cad>;
  register: (data: RequestData) => Promise<boolean>;
}

const RegisterPage = ({ register, cadInfo }: Props) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [registrationCode, setCode] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const success = await register({
      username,
      password,
      password2,
      registration_code: registrationCode,
    });

    if (success === true) {
      router.push("/citizen");
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

      {cadInfo?.registration_code ? (
        <div className="mb-3">
          <label className="form-label" htmlFor="registration_code">
            {lang.admin.registration_code}
          </label>
          <input
            type="password"
            value={registrationCode}
            onChange={(e) => setCode(e.target.value)}
            id="registration_code"
            className="form-control"
          />
        </div>
      ) : null}

      <div className="mb-3">
        <Link href="/auth/login">
          <a>{lang.auth.login}</a>
        </Link>
        <button disabled={loading} type="submit" className="btn btn-primary float-end w-100 mt-2">
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps, { register })(RegisterPage);
