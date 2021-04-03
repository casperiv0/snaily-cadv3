import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Deputy from "../../interfaces/Deputy";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { getMyDeputies, deleteEmsFdDeputy } from "../../lib/actions/ems-fd";
import { connect } from "react-redux";
import useDocTitle from "../../hooks/useDocTitle";
import { ModalIds } from "../../lib/types";
import CreateDeputyModal from "../../components/modals/ems-fd/CreateDeputyModal";

interface Props {
  deputies: Deputy[];
  getMyDeputies: () => void;
  deleteEmsFdDeputy: (id: string) => void;
}

const MyDeputiesPage: React.FC<Props> = ({ deputies, getMyDeputies, deleteEmsFdDeputy }) => {
  useDocTitle(lang.ems_fd.my_deputies);
  React.useEffect(() => {
    getMyDeputies();
  }, [getMyDeputies]);

  return (
    <Layout classes="mt-5">
      <h4 className="card-title mt-3">{lang.ems_fd.my_deputies}</h4>

      <div className="d-flex gap-2 mb-2">
        <Link className="btn btn-primary container" to="/ems-fd/dash">
          {lang.ems_fd.ems_dash}
        </Link>
        <button
          className="btn btn-primary container"
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.CreateEmsFd}`}
        >
          {lang.ems_fd.create_a_dept}
        </button>
      </div>

      <ul className="list-group mt-1">
        {deputies.map((deputy: Deputy, idx: number) => {
          return (
            <li
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between"
            >
              <p>
                {++idx} | {deputy.name}
              </p>
              <div>
                <button onClick={() => deleteEmsFdDeputy(deputy.id)} className="btn btn-danger">
                  {lang.global.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <CreateDeputyModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
});

export default connect(mapToProps, { getMyDeputies, deleteEmsFdDeputy })(MyDeputiesPage);
