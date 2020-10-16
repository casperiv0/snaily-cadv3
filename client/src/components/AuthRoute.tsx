import * as React from "react";
import { checkAuth } from "../lib/actions/auth";
import { connect } from "react-redux";
import State from "../interfaces/State";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";

interface Props {
  Component: React.FC<RouteComponentProps>;
  isAuth: boolean;
  path: string;
}

const AuthRoute: React.FC<Props> = ({ Component, isAuth, path }) => {
  return (
    <Route
      exact
      path={path}
      render={(props: RouteComponentProps) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                message: "You need to be logged in to view this page",
                requestedPath: path,
              },
            }}
          />
        )
      }
    />
  );
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapToProps, { checkAuth })(AuthRoute);
