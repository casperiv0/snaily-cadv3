import * as React from "react";
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
  message: Message;
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
      <a className="btn btn-primary container" href="/leo/dash">
        {lang.global.back_to_dashboard}
      </a>
      <a className="btn btn-primary container mt-2 mb-2" href="/leo/officers/create">
        {lang.officers.create_an_officer}
      </a>

      <ul className="list-group">
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
                  {++idx} | {officer.officer_dept} | {officer.officer_name}
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
