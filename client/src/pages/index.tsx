import * as React from "react";
import { connect } from "react-redux";
import Layout from "../components/Layout";
import State from "../interfaces/State";
import User from "../interfaces/User";
import lang from "../language.json";

interface Props {
  isAuth: boolean;
  user: User;
}

const HomePage: React.FC<Props> = ({ isAuth, user }) => {
  return (
    <Layout>
      {isAuth ? (
        <>
          <h2>Welcome Back {user?.username}!</h2>
          <a className="btn btn-primary mb-2 w-100" href="/citizen">
            Citizens Page
          </a>
        </>
      ) : (
        <>
          <a className="btn btn-primary mb-2 w-100" href="/login">
            {lang.auth.login}
          </a>
          <a className="btn btn-primary w-100" href="/register">
            {lang.auth.register}
          </a>
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
    <div className="fixed-bottom text-light bg-dark border-dark pl-2 pt-2">
      <p>
        Feel Free to support me <a href="https://www.paypal.me/caspertheghosty">here</a>
      </p>
      <p>
        <a href="https://caspertheghost.me">CasperTheGhost</a> | Thanks for choosing SnailyCAD!
      </p>
    </div>
  );
};
