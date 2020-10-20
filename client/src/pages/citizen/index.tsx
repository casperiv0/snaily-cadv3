import * as React from "react";
import Layout from "../../components/Layout";
import CallTowModal from "../../components/modals/callTowModal";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { logout } from "../../lib/actions/auth";
import { connect } from "react-redux";
import AlertMessage from "../../components/alert-message";

interface Props {
  aop: string;
  message: string;
  logout: () => void;
}

const CitizensPage: React.FC<Props> = (props) => {
  const [aop, setAop] = React.useState(props.aop);

  React.useEffect(() => {
    document.title = "Citizen - View and change all your citizens";
  });

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });
  }, []);

  return (
    <Layout classes="mt-5">
      <div>
        {props.message ? (
          <AlertMessage type="success" message={props.message} />
        ) : null}
        <h3>
          {lang.auth.welcome} - AOP: {aop}
        </h3>

        <div className="d-flex">
          <button onClick={props.logout} className="btn btn-danger col">
            {lang.auth.logout}
          </button>
          <a href="/account" className="ml-1 col btn btn-primary">
            {lang.auth.account.account}
          </a>
        </div>

        <div className="d-flex mt-1">
          <a href="/citizen/create" className="col btn btn-primary">
            {lang.citizen.create_new_citizen}
          </a>
          <a href="/vehicles/register" className="col ml-1 btn btn-primary">
            {lang.citizen.reg_new_vehicle}
          </a>
          <a href="/weapons/register" className="col ml-1 btn btn-primary">
            {lang.citizen.reg_new_weapon}
          </a>
        </div>

        <div className="d-flex mt-1">
          <a href="/manage-companies" className="col btn btn-primary">
            {lang.citizen.employment_status}
          </a>
          <button
            data-toggle="modal"
            data-target="#callTowModal"
            className="col ml-1 btn btn-primary"
          >
            {lang.citizen.call_tow}
          </button>
          <button
            data-toggle="modal"
            data-target="#call911Modal"
            className="col ml-1 btn btn-primary"
          >
            {lang.citizen.call_911}
          </button>
        </div>
      </div>

      <CallTowModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps, { logout })(CitizensPage);
