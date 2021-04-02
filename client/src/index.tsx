import lang from "./language.json";
import Bootstrap from "bootstrap";

declare global {
  interface Window {
    /**
     * The imported language file for SnailyCAD
     */
    lang: any;
    bootstrap: typeof Bootstrap;
  }
}

import "./styles/global.css";
import "./lib/socket";
import * as React from "react";
import * as Redux from "react-redux";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthRoute from "./components/AuthRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loader from "./components/loader";
import Navbar from "./components/navbar";
import store from "./lib/store";
const SupervisorPanelPage = React.lazy(() => import("./pages/admin/management/supervisor"));

const HomePage = React.lazy(() => import("./pages/index"));
const NotFoundPage = React.lazy(() => import("./pages/not-found"));
const ForbiddenPage = React.lazy(() => import("./pages/forbidden"));
const NotEnabledPage = React.lazy(() => import("./pages/not-enabled"));

const BleeterPage = React.lazy(() => import("./pages/bleeter"));
const BleetPage = React.lazy(() => import("./pages/bleeter/bleet"));
const EditBleet = React.lazy(() => import("./pages/bleeter/edit-bleet"));
const CreateBleetPage = React.lazy(() => import("./pages/bleeter/create-bleet"));
const Login = React.lazy(() => import("./pages/auth/login"));
const Register = React.lazy(() => import("./pages/auth/register"));

const LeoDash = React.lazy(() => import("./pages/leo/dash"));
const OfficerLogsPage = React.lazy(() => import("./pages/leo/logs"));
const PenalCodesPage = React.lazy(() => import("./pages/leo/penal-codes"));
const MyOfficersPage = React.lazy(() => import("./pages/leo/my-officers"));

const DispatchDash = React.lazy(() => import("./pages/dispatch/dash"));

const CitizensPage = React.lazy(() => import("./pages/citizen/index"));
const CreateCitizenPage = React.lazy(() => import("./pages/citizen/create-citizen"));
const CitizenInfoPage = React.lazy(() => import("./pages/citizen/citizen-info"));
const EditCitizenPage = React.lazy(() => import("./pages/citizen/edit-citizen"));
const ManageCompaniesPage = React.lazy(() => import("./pages/citizen/company/manage-companies"));
const CompanyPage = React.lazy(() => import("./pages/citizen/company/company"));
const CreateCompanyPost = React.lazy(() => import("./pages/citizen/company/create-post"));
const ManageCompanyPage = React.lazy(() => import("./pages/citizen/company/manage/index"));
const ManageEmployeePage = React.lazy(
  () => import("./pages/citizen/company/manage/manage-employee"),
);

const EditVehiclePage = React.lazy(() => import("./pages/citizen/vehicles/edit-vehicle"));
const TransferVehiclePage = React.lazy(() => import("./pages/citizen/vehicles/transfer-vehicle"));

const TowDash = React.lazy(() => import("./pages/tow/dash"));

const TruckLogsDash = React.lazy(() => import("./pages/truck-logs/dash"));

const EmsFdDash = React.lazy(() => import("./pages/ems-fd/dash"));
const MyEmsDeputiesPage = React.lazy(() => import("./pages/ems-fd/my-deputies"));
const CreateDeputyPage = React.lazy(() => import("./pages/ems-fd/create-deputy"));

const AccountPage = React.lazy(() => import("./pages/account/index"));
const LogoutPage = React.lazy(() => import("./pages/logout"));

const ValuesPage = React.lazy(() => import("./pages/admin/values/index"));
const AddValuePage = React.lazy(() => import("./pages/admin/values/add-value"));
const EditValuePage = React.lazy(() => import("./pages/admin/values/edit-value"));
const AdminPage = React.lazy(() => import("./pages/admin/index"));
const ManageMembersPage = React.lazy(() => import("./pages/admin/management/members/index"));
const ManageMemberPage = React.lazy(() => import("./pages/admin/management/members/manage-member"));
const ManageCitizensPage = React.lazy(() => import("./pages/admin/management/citizens/index"));
const CompanyManagementPage = React.lazy(
  () => import("./pages/admin/management/company-management"),
);

const ManageUnitPage = React.lazy(() => import("./pages/admin/management/supervisor/manage-unit"));

window.lang = lang;

const CadSettingsPage = React.lazy(() => import("./pages/admin/cad-settings"));
const Map = React.lazy(() => import("./pages/dispatch/map"));
const TaxiDash = React.lazy(() => import("./pages/taxi/dash"));
const CourthousePage = React.lazy(() => import("./pages/Court"));

const Codes10Management = React.lazy(() => import("./pages/admin/management/10-codes"));
const Edit10Code = React.lazy(() => import("./pages/admin/management/10-codes/edit-code"));

const PenalCodesManagement = React.lazy(() => import("./pages/admin/management/penal-codes"));
const AddPenalCode = React.lazy(() => import("./pages/admin/management/penal-codes/add-code"));
const EditPenalCode = React.lazy(() => import("./pages/admin/management/penal-codes/edit-code"));

ReactDOM.render(
  <React.StrictMode>
    <Redux.Provider store={store}>
      <Router>
        <ToastContainer
          pauseOnFocusLoss={false}
          hideProgressBar
          limit={5}
          newestOnTop
          autoClose={3000}
          draggablePercent={40}
          closeButton={false}
          toastStyle={{
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
            background: "var(--bs-danger)",
          }}
        />
        <Navbar />
        <React.Suspense fallback={<Loader fullScreen />}>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <AuthRoute path="/bleeter/create" Component={CreateBleetPage} />
            <AuthRoute path="/bleeter" Component={BleeterPage} />
            <AuthRoute path="/bleet/edit/:id" Component={EditBleet} />
            <AuthRoute path="/bleet/:id" Component={BleetPage} />
            <AuthRoute requirement="leo" path="/leo/my-logs" Component={OfficerLogsPage} />
            <AuthRoute requirement="leo" path="/leo/dash" Component={LeoDash} />
            <AuthRoute requirement="leo" path="/leo/penal-codes" Component={PenalCodesPage} />
            <AuthRoute requirement="leo" path="/leo/my-officers" Component={MyOfficersPage} />

            <AuthRoute requirement="dispatch" path="/dispatch/map" Component={Map} />
            <AuthRoute requirement="dispatch" path="/dispatch" Component={DispatchDash} />
            <Route path="/court" render={() => (window.location.pathname = "/courthouse")} />
            <AuthRoute path="/courthouse" Component={CourthousePage} />
            <AuthRoute
              path="/company/:citizenId/:companyId/manage/:id"
              Component={ManageEmployeePage}
            />
            <AuthRoute path="/company/:citizenId/:companyId/manage" Component={ManageCompanyPage} />
            <AuthRoute
              path="/company/:citizenId/:companyId/create-post"
              Component={CreateCompanyPost}
            />
            <AuthRoute path="/company/:citizenId/:companyId" Component={CompanyPage} />
            <AuthRoute path="/citizen/manage-companies" Component={ManageCompaniesPage} />
            <AuthRoute path="/citizen/create" Component={CreateCitizenPage} />
            <AuthRoute path="/citizen/:id/edit" Component={EditCitizenPage} />
            <AuthRoute path="/citizen/:id" Component={CitizenInfoPage} />
            <AuthRoute path="/citizen" Component={CitizensPage} />
            <AuthRoute path="/vehicles/edit/:id" Component={EditVehiclePage} />
            <AuthRoute path="/vehicles/transfer/:id" Component={TransferVehiclePage} />
            <AuthRoute requirement="tow" path="/tow" Component={TowDash} />
            <AuthRoute path="/taxi" Component={TaxiDash} />
            <AuthRoute path="/truck-logs" Component={TruckLogsDash} />
            <AuthRoute requirement="ems_fd" path="/ems-fd/dash" Component={EmsFdDash} />
            <AuthRoute
              requirement="ems_fd"
              path="/ems-fd/deputies/create"
              Component={CreateDeputyPage}
            />
            <AuthRoute requirement="ems_fd" path="/ems-fd/deputies" Component={MyEmsDeputiesPage} />
            <AuthRoute path="/account" Component={AccountPage} />
            <AuthRoute
              path="/admin/manage/members/:id"
              requirement="admin"
              Component={ManageMemberPage}
            />
            <AuthRoute
              path="/admin/manage/members"
              requirement="admin"
              Component={ManageMembersPage}
            />
            <AuthRoute
              path="/admin/manage/citizens"
              requirement="admin"
              Component={ManageCitizensPage}
            />
            <AuthRoute
              path="/admin/manage/companies"
              requirement="admin"
              Component={CompanyManagementPage}
            />
            <AuthRoute
              path="/admin/manage/units/:id"
              requirement="supervisor"
              Component={ManageUnitPage}
            />
            <AuthRoute
              path="/admin/manage/units"
              requirement="supervisor"
              Component={SupervisorPanelPage}
            />
            <AuthRoute
              path="/admin/manage/10-codes/edit/:id"
              requirement="supervisor"
              Component={Edit10Code}
            />
            <AuthRoute
              path="/admin/manage/10-codes"
              requirement="supervisor"
              Component={Codes10Management}
            />
            <AuthRoute
              path="/admin/manage/penal-codes/edit/:id"
              requirement="supervisor"
              Component={EditPenalCode}
            />
            <AuthRoute
              path="/admin/manage/penal-codes/add"
              requirement="supervisor"
              Component={AddPenalCode}
            />
            <AuthRoute
              path="/admin/manage/penal-codes"
              requirement="supervisor"
              Component={PenalCodesManagement}
            />
            <AuthRoute
              path="/admin/values/:path/:id/edit"
              requirement="admin"
              Component={EditValuePage}
            />
            <AuthRoute
              path="/admin/values/:path/add"
              requirement="admin"
              Component={AddValuePage}
            />
            <AuthRoute path="/admin/values/:path" requirement="admin" Component={ValuesPage} />
            <AuthRoute path="/admin/cad-settings" requirement="admin" Component={CadSettingsPage} />
            <AuthRoute path="/admin" requirement="admin" Component={AdminPage} />
            <Route path="/logout" component={LogoutPage} />
            <Route path="/forbidden" component={ForbiddenPage} />
            <Route path="/not-enabled" component={NotEnabledPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </Redux.Provider>
  </React.StrictMode>,
  document.getElementById("app-mount"),
);
