import * as React from "react";
import { connect } from "react-redux";
import State from "../interfaces/State";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";

interface Props {
  Component: any;
  isAuth: boolean;
  loading: boolean;
  path: string;
}

const AuthRoute: React.FC<Props> = ({ Component, loading, isAuth, path }) => {
  if (loading) {
    return null;
  }

  return (
    <Route
      exact
      path={path}
      render={(props: RouteComponentProps) =>
        !loading && isAuth ? (
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
  loading: state.auth.loading,
});

export default connect(mapToProps)(AuthRoute);
