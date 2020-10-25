import * as React from "react";
import Layout from "../../components/Layout";
import AlertMessage from "../../components/alert-message";
import Deputy from "../../interfaces/Deputy";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { getMyDeputies, deleteEmsFdDeputy } from "../../lib/actions/ems-fd";
import { connect } from "react-redux";

interface Props {
  message: string;
  deputies: Deputy[];
  getMyDeputies: () => void;
  deleteEmsFdDeputy: (id: string) => void;
}

const MyDeputiesPage: React.FC<Props> = ({
  message,
  deputies,
  getMyDeputies,
  deleteEmsFdDeputy,
}) => {
  React.useEffect(() => {
    getMyDeputies();
  }, [getMyDeputies]);

  return (
    <Layout classes="mt-5">
      {message ? <AlertMessage type="success" message={message} /> : null}

      <h4 className="card-title mt-3">{lang.ems_fd.my_deputies}</h4>

      <ul className="list-group">
        <a className="btn btn-primary mt-1" href="/ems-fd/dash">
          {lang.ems_fd.ems_dash}
        </a>
        <a className="btn btn-primary mt-1" href="/ems-fd/deputies/create">
          {lang.ems_fd.create_a_dept}
        </a>

        {deputies.map((deputy: Deputy, idx: number) => {
          return (
            <li
              key={idx}
              id={`${idx}`}
              className="list-group-item mt-2 bg-dark border-dark d-flex justify-content-between"
            >
              <p>
                {++idx} | {deputy.name}
              </p>

              <button
                onClick={() => deleteEmsFdDeputy(deputy.id)}
                type="button"
                className="btn btn-danger"
              >
                {lang.global.delete}
              </button>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
  message: state.global.message,
});

export default connect(mapToProps, { getMyDeputies, deleteEmsFdDeputy })(MyDeputiesPage);
