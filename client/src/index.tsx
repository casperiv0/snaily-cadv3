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

const NotFoundPage = React.lazy(() => import("./pages/not-found"));

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

const CitizensPage = React.lazy(() => import("./pages/citizen/index"));
const CreateCitizenPage = React.lazy(
  () => import("./pages/citizen/create-citizen")
);
const CitizenInfoPage = React.lazy(
  () => import("./pages/citizen/citizen-info")
);

const TowDash = React.lazy(() => import("./pages/tow/dash"));

const TruckLogsDash = React.lazy(() => import("./pages/truck-logs/dash"));
const CreateTruckLogPage = React.lazy(
  () => import("./pages/truck-logs/create-truck-log")
);

const EmsFdDash = React.lazy(() => import("./pages/ems-fd/dash"));
const MyEmsDeputiesPage = React.lazy(
  () => import("./pages/ems-fd/my-deputies")
);
const CreateDeputyPage = React.lazy(
  () => import("./pages/ems-fd/create-deputy")
);

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

            <AuthRoute path="/citizen/create" Component={CreateCitizenPage} />
            <AuthRoute path="/citizen/:id" Component={CitizenInfoPage} />
            <AuthRoute path="/citizen" Component={CitizensPage} />

            <AuthRoute requirement="tow" path="/tow" Component={TowDash} />

            <AuthRoute
              path="/truck-logs/create"
              Component={CreateTruckLogPage}
            />
            <AuthRoute path="/truck-logs" Component={TruckLogsDash} />

            <AuthRoute
              requirement="ems_fd"
              path="/ems-fd/dash"
              Component={EmsFdDash}
            />
            <AuthRoute
              requirement="ems_fd"
              path="/ems-fd/deputies/create"
              Component={CreateDeputyPage}
            />
            <AuthRoute
              requirement="ems_fd"
              path="/ems-fd/deputies"
              Component={MyEmsDeputiesPage}
            />

            <Route component={NotFoundPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </Redux.Provider>
  </React.StrictMode>,
  document.getElementById("app-mount")
);
