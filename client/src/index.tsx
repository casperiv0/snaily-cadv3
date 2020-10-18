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

const BleeterPage = React.lazy(() => import("./pages/bleeter"));
const BleetPage = React.lazy(() => import("./pages/bleeter/bleet"));
const EditBleet = React.lazy(() => import("./pages/bleeter/edit-bleet"));
const Login = React.lazy(() => import("./pages/auth/login"));
const Register = React.lazy(() => import("./pages/auth/register"));

const LeoDash = React.lazy(() => import("./pages/leo/dash"));
const PenalCodesPage = React.lazy(() => import("./pages/leo/penal-codes"));
const MyOfficersPage = React.lazy(() => import("./pages/leo/my-officers"));
const CreateOfficerPage = React.lazy(
  () => import("./pages/leo/create-officer")
);

const DispatchDash = React.lazy(() => import("./pages/dispatch/dash"));

ReactDOM.render(
  <React.StrictMode>
    <Redux.Provider store={store}>
      <Navbar />
      <Router>
        <React.Suspense fallback={<Loader fullScreen />}>
          <Switch>
            <Route path="/" exact render={() => <h1>Hello world</h1>} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <AuthRoute path="/bleeter" Component={BleeterPage} />
            <AuthRoute path="/bleet/edit/:id" Component={EditBleet} />
            <AuthRoute path="/bleet/:id" Component={BleetPage} />

            <AuthRoute requirement="leo" path="/leo/dash" Component={LeoDash} />
            <AuthRoute
              requirement="leo"
              path="/leo/penal-codes"
              Component={PenalCodesPage}
            />
            <AuthRoute
              requirement="leo"
              path="/leo/my-officers"
              Component={MyOfficersPage}
            />
            <AuthRoute
              requirement="leo"
              path="/leo/officers/create"
              Component={CreateOfficerPage}
            />

            <AuthRoute
              requirement="dispatch"
              path="/dispatch"
              Component={DispatchDash}
            />
          </Switch>
        </React.Suspense>
      </Router>
    </Redux.Provider>
  </React.StrictMode>,
  document.getElementById("app-mount")
);
