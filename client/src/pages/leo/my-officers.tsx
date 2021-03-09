import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Officer from "../../interfaces/Officer";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { getMyOfficers, deleteOfficer } from "../../lib/actions/officer";
import AlertMessage from "../../components/alert-message";
import Message from "../../interfaces/Message";

interface Props {
  officers: Officer[];
  message: Message | null;
  getMyOfficers: () => void;
  deleteOfficer: (id: string) => void;
}

const MyOfficersPage: React.FC<Props> = ({ officers, message, deleteOfficer, getMyOfficers }) => {
  React.useEffect(() => {
    getMyOfficers();
  }, [getMyOfficers]);

  return (
    <Layout classes="mt-5">
      {message ? <AlertMessage message={message} dismissible /> : null}
      <h3>{lang.officers.my_officers}</h3>
      <Link className="btn btn-primary text-light w-100 p-2" to="/leo/dash">
        {lang.global.back_to_dashboard}
      </Link>
      <Link className="btn btn-primary text-light w-100 p-2 my-2" to="/leo/my-logs">
        My officer logs
      </Link>
      <Link className="btn btn-dark text-light w-100 p-2" to="/leo/officers/create">
        {lang.officers.create_an_officer}
      </Link>

      <ul className="list-group mt-2">
        {!officers[0] ? (
          <p>You don not have any officers.</p>
        ) : (
          officers.map((officer: Officer, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                <p>
                  {++idx} | {officer.callsign || "None"} | {officer.officer_dept} |{" "}
                  {officer.officer_name}
                </p>
                <div>
                  <button onClick={() => deleteOfficer(officer.id)} className="btn btn-danger">
                    {lang.global.delete}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
  message: state.global.message,
});

export default connect(mapToProps, { getMyOfficers, deleteOfficer })(MyOfficersPage);
