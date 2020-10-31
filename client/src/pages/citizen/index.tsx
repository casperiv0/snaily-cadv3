import * as React from "react";
import Layout from "../../components/Layout";
import CallTowModal from "../../components/modals/callTowModal";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import AlertMessage from "../../components/alert-message";
import Citizen from "../../interfaces/Citizen";
import Call911Modal from "../../components/modals/call911Modal";
import { logout } from "../../lib/actions/auth";
import { connect } from "react-redux";
import { getCitizens } from "../../lib/actions/citizen";

interface Props {
  aop: string;
  message: string;
  citizens: Citizen[];
  logout: () => void;
  getCitizens: () => void;
}

const CitizensPage: React.FC<Props> = (props) => {
  const { message, citizens, getCitizens, logout } = props;
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
        {message ? <AlertMessage type="success" message={message} dismissible /> : null}
        <h3>
          {lang.auth.welcome} - AOP: {aop}
        </h3>

        <div className="d-flex">
          <button onClick={logout} className="btn btn-danger col">
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

      <ul className="list-group mt-3">
        {!citizens[0] ? (
          <AlertMessage message={lang.citizen.no_citizens_found} type="warning" />
        ) : (
          citizens.map((citizen: Citizen, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item mb-1 bg-dark border-secondary d-flex justify-content-between"
              >
                {citizen.full_name}

                <a className="btn btn-primary" href={`/citizen/${citizen.id}`}>
                  {lang.citizen.more_info}
                </a>
              </li>
            );
          })
        )}
      </ul>

      <CallTowModal />
      <Call911Modal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps, { logout, getCitizens })(CitizensPage);
