import { GetServerSideProps } from "next";
import { connect } from "react-redux";
import * as React from "react";
import Link from "next/link";
import { verifyAuth } from "@actions/auth/AuthActions";
import { initializeStore } from "@state/useStore";
import { Layout } from "src/components/Layout";
import { User } from "types/User";
import lang from "../language.json";
import { State } from "types/State";
interface Props {
  isAuth: boolean;
  user: User | null;
}

const IndexPage = ({ isAuth, user }: Props) => {
  return (
    <Layout>
      {isAuth ? (
        <>
          <h2>Welcome Back {user?.username}!</h2>
          <Link href="/citizen">
            <a className="btn btn-dark mb-2 w-100 p-2">Citizens Page</a>
          </Link>
        </>
      ) : (
        <>
          <Link href="/auth/login">
            <a className="btn btn-dark mb-2 w-100 p-2">{lang.auth.login}</a>
          </Link>
          <Link href="/auth/register">
            <a className="btn btn-dark w-100 p-2">{lang.auth.register}</a>
          </Link>
        </>
      )}

      <Credits />
    </Layout>
  );
};

const Credits: React.FC = () => {
  return (
    <div className="fixed-bottom text-light bg-dark border-dark px-3 pt-3 d-flex justify-content-between">
      <p>
        <a href="https://caspertheghost.me">CasperTheGhost</a> | Thanks for choosing SnailyCAD!
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapToProps)(IndexPage);
