import * as React from "react";
import { connect } from "react-redux";
import State from "../interfaces/State";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import User from "../interfaces/User";
import Loader from "./loader";

interface Props {
  Component: any;
  isAuth: boolean;
  loading: boolean;
  path: string;
  requirement?: "admin" | "leo" | "dispatch" | "tow" | "ems_fd";
  user: User;
}

const AuthRoute: React.FC<Props> = ({
  Component,
  loading,
  isAuth,
  path,
  user,
  requirement,
}) => {
  React.useEffect(() => {
    if (requirement && !loading && isAuth) {
      switch (requirement) {
        case "leo": {
          if (user?.leo !== "1") {
            window.location.href = "/forbidden";
          }
          break;
        }
        case "tow": {
          if (user?.tow !== "1") {
            window.location.href = "/forbidden";
          }
          break;
        }
      }
    }
  });

  if (loading) {
    return <Loader fullScreen />;
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
  user: state.auth.user,
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export default connect(mapToProps)(AuthRoute);
