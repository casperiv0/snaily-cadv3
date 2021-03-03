import * as React from "react";
import { connect } from "react-redux";
import State from "../interfaces/State";
import { Redirect, Route, RouteComponentProps, useHistory, useLocation } from "react-router-dom";
import User from "../interfaces/User";
import Loader from "./loader";

interface Props {
  Component: any;
  isAuth: boolean;
  loading: boolean;
  path: string;
  requirement?: "admin" | "leo" | "dispatch" | "tow" | "ems_fd" | "supervisor";
  user: User | null;
}

export const adminRanks: string[] = ["owner", "admin", "moderator"];

const AuthRoute: React.FC<Props> = ({ Component, loading, isAuth, path, user, requirement }) => {
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    if (requirement && !loading && isAuth) {
      switch (requirement) {
        case "leo":
          if (user?.leo === "0") {
            return history.push("/forbidden");
          }
          break;
        case "dispatch":
          if (user?.dispatch === "0") {
            return history.push("/forbidden");
          }
          break;
        case "tow":
          if (user?.tow === "0") {
            history.push("/forbidden");
          }
          break;
        case "ems_fd":
          if (user?.ems_fd === "0") {
            history.push("/forbidden");
          }
          break;
        case "supervisor":
          if (user?.supervisor === "1") break;

          if (!adminRanks.includes(`${user?.rank}`)) {
            history.push("/forbidden");
          }
          break;

        case "admin":
          if (!adminRanks.includes(`${user?.rank}`)) {
            history.push("/forbidden");
          }
          break;
        default:
          break;
      }
    }
  }, [history, isAuth, loading, requirement, user]);

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
                requestedPath: location.pathname,
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
