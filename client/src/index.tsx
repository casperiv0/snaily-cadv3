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

const HomePage = React.lazy(() => import("./pages/index"));
const NotFoundPage = React.lazy(() => import("./pages/not-found"));
const ForbiddenPage = React.lazy(() => import("./pages/forbidden"));

const BleeterPage = React.lazy(() => import("./pages/bleeter"));
const BleetPage = React.lazy(() => import("./pages/bleeter/bleet"));
const EditBleet = React.lazy(() => import("./pages/bleeter/edit-bleet"));
const CreateBleetPage = React.lazy(() => import("./pages/bleeter/create-bleet"));
const Login = React.lazy(() => import("./pages/auth/login"));
const Register = React.lazy(() => import("./pages/auth/register"));

const LeoDash = React.lazy(() => import("./pages/leo/dash"));
const PenalCodesPage = React.lazy(() => import("./pages/leo/penal-codes"));
const MyOfficersPage = React.lazy(() => import("./pages/leo/my-officers"));
const CreateOfficerPage = React.lazy(() => import("./pages/leo/create-officer"));

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

const CreateMedicalRecordPage = React.lazy(
  () => import("./pages/citizen/medical-records/create-medical-record"),
);

const EditLicensesPage = React.lazy(() => import("./pages/citizen/edit-licenses"));

const RegisterWeaponPage = React.lazy(() => import("./pages/citizen/weapons/register-weapon"));

const RegisterVehiclePage = React.lazy(() => import("./pages/citizen/vehicles/register-vehicle"));
const EditVehiclePage = React.lazy(() => import("./pages/citizen/vehicles/edit-vehicle"));
const TransferVehiclePage = React.lazy(() => import("./pages/citizen/vehicles/transfer-vehicle"));

const TowDash = React.lazy(() => import("./pages/tow/dash"));

const TruckLogsDash = React.lazy(() => import("./pages/truck-logs/dash"));
const CreateTruckLogPage = React.lazy(() => import("./pages/truck-logs/create-truck-log"));

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
const OfficersManagementPage = React.lazy(
  () => import("./pages/admin/management/officers/officers-management"),
);
const ManageOfficerPage = React.lazy(
  () => import("./pages/admin/management/officers/manage-officer"),
);

const CadSettingsPage = React.lazy(() => import("./pages/admin/cad-settings"));
// const Map = React.lazy(() => import("./pages/dispatch/map"));
const TaxiDash = React.lazy(() => import("./pages/taxi/dash"));
const CourthousePage = React.lazy(() => import("./pages/Court"));

ReactDOM.render(
  <React.StrictMode>
    <Redux.Provider store={store}>
      <Router>
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

            <AuthRoute requirement="leo" path="/leo/dash" Component={LeoDash} />
            <AuthRoute requirement="leo" path="/leo/penal-codes" Component={PenalCodesPage} />
            <AuthRoute requirement="leo" path="/leo/my-officers" Component={MyOfficersPage} />
            <AuthRoute
              requirement="leo"
              path="/leo/officers/create"
              Component={CreateOfficerPage}
            />

            {/* <AuthRoute requirement="dispatch" path="/dispatch/map" Component={Map} /> */}
            <AuthRoute requirement="dispatch" path="/dispatch" Component={DispatchDash} />

            <AuthRoute path="/court" Component={CourthousePage} />

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

            <AuthRoute path="/licenses/edit/:id" Component={EditLicensesPage} />

            <AuthRoute path="/weapons/register" Component={RegisterWeaponPage} />

            <AuthRoute path="/vehicles/register" Component={RegisterVehiclePage} />
            <AuthRoute path="/vehicles/edit/:id" Component={EditVehiclePage} />
            <AuthRoute path="/vehicles/transfer/:id" Component={TransferVehiclePage} />

            <AuthRoute path="/medical-records/create/:id" Component={CreateMedicalRecordPage} />

            <AuthRoute requirement="tow" path="/tow" Component={TowDash} />
            <AuthRoute path="/taxi" Component={TaxiDash} />

            <AuthRoute path="/truck-logs/create" Component={CreateTruckLogPage} />
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
              path="/admin/manage/officers/:id"
              requirement="admin"
              Component={ManageOfficerPage}
            />
            <AuthRoute
              path="/admin/manage/officers"
              requirement="admin"
              Component={OfficersManagementPage}
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
            <Route component={NotFoundPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </Redux.Provider>
  </React.StrictMode>,
  document.getElementById("app-mount"),
);
