import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Officer from "../../interfaces/Officer";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { connect } from "react-redux";
import { getMyOfficers, deleteOfficer } from "../../lib/actions/officer";
import useDocTitle from "../../hooks/useDocTitle";
import CreateOfficerModal from "../../components/modals/leo/CreateOfficerModal";
import { ModalIds } from "../../lib/types";

interface Props {
  officers: Officer[];
  getMyOfficers: () => void;
  deleteOfficer: (id: string) => void;
}

const MyOfficersPage: React.FC<Props> = ({ officers, deleteOfficer, getMyOfficers }) => {
  useDocTitle("My officers");
  React.useEffect(() => {
    getMyOfficers();
  }, [getMyOfficers]);

  return (
    <Layout classes="mt-5">
      <h3>{lang.officers.my_officers}</h3>

      <div className="d-flex justify-content-between mb-2">
        <Link className="btn btn-primary text-light w-100" to="/leo/dash">
          {lang.global.back_to_dashboard}
        </Link>
        <Link className="btn btn-primary text-light w-100 ms-2" to="/leo/my-logs">
          {window.lang.officers.logs}
        </Link>
      </div>

      <button
        data-bs-toggle="modal"
        data-bs-target={`#${ModalIds.CreateOfficer}`}
        className="btn btn-dark text-light w-100 p-2"
      >
        {lang.officers.create_an_officer}
      </button>

      <ul className="list-group mt-2">
        {!officers[0] ? (
          <p>{window.lang.officers.no_officers}</p>
        ) : (
          officers.map((officer: Officer, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
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

      <CreateOfficerModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
});

export default connect(mapToProps, { getMyOfficers, deleteOfficer })(MyOfficersPage);
