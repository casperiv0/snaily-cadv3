import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import CallTowModal from "../../components/modals/callTowModal";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import AlertMessage from "../../components/alert-message";
import Citizen from "../../interfaces/Citizen";
import Call911Modal from "../../components/modals/call911Modal";
import { getCitizens } from "../../lib/actions/citizen";
import Message from "../../interfaces/Message";
import CallTaxiModal from "../../components/modals/callTaxiModal";

interface Props {
  aop: string | null;
  message: Message | null;
  citizens: Citizen[];
  getCitizens: () => void;
}

const CitizensPage: React.FC<Props> = (props) => {
  const { message, citizens, getCitizens } = props;
  const [aop, setAop] = React.useState(props.aop);

  React.useEffect(() => {
    document.title = "Citizen - View and change all your citizens";
  });

  React.useEffect(() => {
    getCitizens();
  }, [getCitizens]);

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });
  }, []);

  return (
    <Layout classes="mt-5">
      <div>
        {message ? <AlertMessage message={message} dismissible /> : null}
        <h3>
          {lang.auth.welcome} - AOP: {aop}
        </h3>

        <div className="d-flex">
          <Link to="/logout" className="btn btn-danger col">
            {lang.auth.logout}
          </Link>
          <Link to="/account" className="ms-1 col btn btn-primary">
            {lang.auth.account.account}
          </Link>
        </div>

        <div className="d-flex mt-1">
          <Link to="/citizen/create" className="col btn btn-primary">
            {lang.citizen.create_new_citizen}
          </Link>
          <Link to="/vehicles/register" className="col ms-1 btn btn-primary">
            {lang.citizen.reg_new_vehicle}
          </Link>
          <Link to="/weapons/register" className="col ms-1 btn btn-primary">
            {lang.citizen.reg_new_weapon}
          </Link>
        </div>

        <div className="d-flex mt-1">
          <Link to="/citizen/manage-companies" className="col btn btn-primary">
            {lang.citizen.employment_status}
          </Link>
          <button
            data-bs-toggle="modal"
            data-bs-target="#callTowModal"
            className="col ms-1 btn btn-primary"
          >
            {lang.citizen.call_tow}
          </button>
          <button
            data-bs-toggle="modal"
            data-bs-target="#call911Modal"
            className="col ms-1 btn btn-primary"
          >
            {lang.citizen.call_911}
          </button>
          <button
            data-bs-toggle="modal"
            data-bs-target="#callTaxiModal"
            className="col ms-1 btn btn-primary"
          >
            Create taxi call
          </button>
        </div>
      </div>

      <ul className="list-group mt-3">
        {!citizens[0] ? (
          <AlertMessage message={{ msg: lang.citizen.no_citizens_found, type: "warning" }} />
        ) : (
          citizens.map((citizen: Citizen, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                {citizen.full_name}

                <Link className="btn btn-primary" to={`/citizen/${citizen.id}`}>
                  {lang.citizen.more_info}
                </Link>
              </li>
            );
          })
        )}
      </ul>

      <div id="modals">
        <CallTowModal />
        <Call911Modal />
        <CallTaxiModal />
      </div>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps, { getCitizens })(CitizensPage);
