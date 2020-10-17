import "./styles/global.css";
import "./lib/socket";
import * as React from "react";
import * as Redux from "react-redux";
import ReactDOM from "react-dom";
import AuthRoute from "./components/AuthRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loader from "./components/loader";
import Navbar from "./components/navbar";

import store from "./lib/store";

const BleetPage = React.lazy(() => import("./pages/bleeter"));
const Login = React.lazy(() => import("./pages/auth/login"));

ReactDOM.render(
  <React.StrictMode>
    <Redux.Provider store={store}>
      <Navbar />
      <Router>
        <React.Suspense fallback={<Loader fullScreen />}>
          <Switch>
            <Route path="/" exact render={() => <h1>Hello world</h1>} />
            <Route path="/login" exact component={Login} />
            <AuthRoute path="/bleeter" Component={BleetPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </Redux.Provider>
  </React.StrictMode>,
  document.getElementById("app-mount")
);
