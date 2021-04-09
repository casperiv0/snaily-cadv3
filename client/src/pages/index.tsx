import * as React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import State from "../interfaces/State";
import User from "../interfaces/User";
import lang from "../language.json";
import { notify } from "../lib/functions";

interface Props {
  isAuth: boolean;
  user: User | null;
}

const HomePage: React.FC<Props> = ({ isAuth, user }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.search.includes("auth=success")) {
      notify.success("Successfully connected with steam!");
    }
  }, [location.search]);

  return (
    <Layout>
      {isAuth ? (
        <>
          <h2>Welcome Back {user?.username}!</h2>
          <Link className="btn btn-dark mb-2 w-100 p-2" to="/citizen">
            Citizens Page
          </Link>
        </>
      ) : (
        <>
          <Link className="btn btn-dark mb-2 w-100 p-2" to="/login">
            {lang.auth.login}
          </Link>
          <Link className="btn btn-dark w-100 p-2" to="/register">
            {lang.auth.register}
          </Link>
        </>
      )}

      <Credits />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapToProps, {})(HomePage);

const Credits: React.FC = () => {
  return (
    <div className="fixed-bottom text-light bg-dark border-dark px-3 pt-3 d-flex justify-content-between">
      <p>
        <a href="https://caspertheghost.me">CasperTheGhost</a> | Thanks for choosing SnailyCAD!
      </p>
    </div>
  );
};
